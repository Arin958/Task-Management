const Notification = require("../models/Notification");
const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");
const {cloudinary} = require("../config/cloudinary");
const { uploadPdfToSupabase } = require("../middleware/pdfFile");
const {supabase} = require("../libs/supabase");
// Assuming you have S3 service for file storage

// Get all tasks for a company (with filtering and pagination)
exports.getCompanyTasks = async (req, res) => {
  try {
    const { companyId, role, _id } = req.user;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      priority,
      search,
    } = req.query;

    const filter = { companyId };

    if (role === "employee") {
      filter.$or = [
        { createdBy: _id, visibility: "personal" },
        { assignees: _id, visibility: "company" },
      ];
    } else {
      filter.visibility = "company"; // admins/managers see only company-wide tasks
    }

    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;

    if (search && search.trim() !== "") {
      filter.$or = [
        ...(filter.$or || []),
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      populate: [
        { path: "assignees", select: "name email" },
        { path: "createdBy", select: "name email" },
        { path: "comments.userId", select: "name" },
        { path: "attachments.uploadedBy", select: "name" },
      ],
    };

    const tasks = await Task.paginate(filter, options);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  console.log(req.user);
  try {
    const { taskId } = req.params;
    const { companyId, role, _id } = req.user;

    const task = await Task.findOne({ _id: taskId, companyId })
      .populate("assignees", "name email")
      .populate("createdBy", "name email")
      .populate("comments.userId", "name")
      .populate("attachments.uploadedBy", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if employee is trying to access someone else's task
    if (
      role === "employee" &&
      !task.assignees.some((a) => a._id.toString() === _id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own tasks.",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// Create a new task

exports.createTask = async (req, res) => {
  console.log("Incoming task body:", req.body);

  try {
    const { companyId, _id, role } = req.user;
    const { title, description, status, priority, assignees, dueDate } = req.body;
    const userId = _id;

    // 🔹 Title validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // 🔹 Normalize assignees (handle both stringified JSON and arrays)
    let parsedAssignees = [];
    if (assignees) {
      if (typeof assignees === "string") {
        try {
          parsedAssignees = JSON.parse(assignees); // Convert '["id"]' -> ["id"]
        } catch (e) {
          parsedAssignees = [assignees]; // fallback if single string id
        }
      } else if (Array.isArray(assignees)) {
        parsedAssignees = assignees;
      }
    }

    // 🔹 Validate assignees
    let finalAssignees = [];
    if (parsedAssignees.length > 0) {
      if (["admin", "manager", "superadmin"].includes(role)) {
        const assigneeObjectIds = parsedAssignees.map(id => new mongoose.Types.ObjectId(id));

        const users = await User.find({
          _id: { $in: assigneeObjectIds },
          companyId: new mongoose.Types.ObjectId(companyId),
          isActive: true,
        });

        console.log("Found users:", users.map(u => u._id));
        console.log("Expected assignees:", assigneeObjectIds);

        if (users.length !== parsedAssignees.length) {
          return res.status(400).json({
            success: false,
            message: "One or more assignees are invalid or don't belong to your company",
          });
        }

        finalAssignees = assigneeObjectIds;
      } else if (role === "employee") {
        const hasOtherAssignees = parsedAssignees.some(a => a !== userId.toString());
        if (hasOtherAssignees) {
          return res.status(403).json({
            success: false,
            message: "Employees can only create tasks for themselves",
          });
        }
        finalAssignees = [new mongoose.Types.ObjectId(userId)];
      }
    } else if (role === "employee") {
      finalAssignees = [new mongoose.Types.ObjectId(userId)];
    }

    // 🔹 Status & priority validation
    const allowedStatuses = ["todo", "in-progress", "review", "completed"];
    const allowedPriorities = ["low", "medium", "high", "critical"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }
    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority value",
      });
    }

    // 🔹 Attachments (already processed in uploadAll)
    const attachments = [];
    if (req.files.images?.length) {
      attachments.push(...req.files.images);
    }
    if (req.files.documents?.length) {
      attachments.push(...req.files.documents);
    }

    // 🔹 Create Task
    const task = new Task({
      title,
      description,
      companyId: new mongoose.Types.ObjectId(companyId),
      status: status || "todo",
      priority: priority || "medium",
      assignees: finalAssignees,
      dueDate,
      createdBy: new mongoose.Types.ObjectId(userId),
      visibility: role === "employee" ? "personal" : "company",
      attachments,
    });

    await task.save();

    await task.populate([
      { path: "assignees", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "attachments.uploadedBy", select: "name email" },
    ]);

    // 🔹 Notifications
    if (finalAssignees.length > 0) {
      const notifications = finalAssignees.map(assigneeId => ({
        userId: assigneeId,
        companyId: new mongoose.Types.ObjectId(companyId),
        type: "task-assigned",
        message: `You have been assigned a new task: "${title}"`,
        relatedEntity: { type: "task", id: task._id },
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { companyId, _id: userId, role } = req.user;
    const updates = { ...req.body };

    // 🔹 Find task
    const task = await Task.findOne({ _id: taskId, companyId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // 🔹 Employee permissions
    if (role === "employee") {
      const isCreator = task.createdBy.toString() === userId.toString();
      if (!isCreator) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You can only update tasks you created yourself.",
        });
      }

      // Restrict fields employees can’t change
      delete updates.assignees;
      delete updates.createdBy;
      delete updates.visibility;
    }

    // 🔹 Validate new assignees (admins/managers only)
    if (updates.assignees && updates.assignees.length > 0) {
      const users = await User.find({
        _id: { $in: updates.assignees },
        companyId,
        isActive: true,
      });
      if (users.length !== updates.assignees.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more assignees are invalid or don't belong to your company",
        });
      }
    }

    // 🔹 Track previous assignees to detect new ones
    const prevAssignees = task.assignees.map((id) => id.toString());

    // 🔹 Handle uploaded files (Cloudinary)
    if (req.files) {
      // Replace or append images
      if (req.files.images) {
        const newImages = req.files.images.map((file) => file.path);
        if (updates.replaceImages === "true") {
          task.assets.images = newImages; // overwrite
        } else {
          task.assets.images = [...(task.assets.images || []), ...newImages]; // append
        }
      }

      // Replace or append documents
      if (req.files.documents) {
        const newDocs = req.files.documents.map((file) => file.path);
        if (updates.replaceDocuments === "true") {
          task.assets.documents = newDocs; // overwrite
        } else {
          task.assets.documents = [
            ...(task.assets.documents || []),
            ...newDocs,
          ]; // append
        }
      }
    }

    // 🔹 Apply other updates (skip comments/attachments direct overwrite)
    Object.keys(updates).forEach((key) => {
      if (
        ![
          "comments",
          "attachments",
          "assets",
          "replaceImages",
          "replaceDocuments",
        ].includes(key)
      ) {
        task[key] = updates[key];
      }
    });

    await task.save();

    await task.populate([
      { path: "assignees", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "comments.userId", select: "name" },
      { path: "attachments.uploadedBy", select: "name" },
    ]);

    // 🔹 Notifications
    const newAssignees = task.assignees
      .map((a) => a._id.toString())
      .filter((id) => !prevAssignees.includes(id));

    let notifications = [];

    // Notify all assignees of update
    notifications = task.assignees.map((assignee) => ({
      userId: assignee._id,
      companyId,
      type: "task-updated",
      message: `Task "${task.title}" has been updated`,
      relatedEntity: { type: "task", id: task._id },
    }));

    // Notify newly added assignees
    if (newAssignees.length > 0) {
      const newNotifications = newAssignees.map((assigneeId) => ({
        userId: assigneeId,
        companyId,
        type: "task-assigned",
        message: `You have been assigned to task: "${task.title}"`,
        relatedEntity: { type: "task", id: task._id },
      }));
      notifications.push(...newNotifications);
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { companyId, role, _id } = req.user;
    const userId = _id;

    // Find the task inside the same company
    const task = await Task.findOne({ _id: taskId, companyId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 🔹 Authorization check
    if (role === "employee") {
      const isAssignee = task.assignees?.some(
        (assigneeId) => assigneeId.toString() === userId.toString()
      );
      const isCreator = task.createdBy.toString() === userId.toString();

      if (!isAssignee && !isCreator) {
        return res.status(403).json({
          success: false,
          message: "You can only delete tasks assigned to you or created by you",
        });
      }
    }

    // 🔹 Delete attachments
    if (task.attachments && task.attachments.length > 0) {
      for (const attachment of task.attachments) {
        try {
          if (attachment.mimeType.startsWith("image/")) {
            // Delete from Cloudinary
            const publicId = attachment.url
              .split("/")
              .slice(-2) // folder + filename
              .join("/")
              .split(".")[0]; // remove extension

            await cloudinary.uploader.destroy(publicId);
          } else {
            // Delete from Supabase
            const { error } = await supabase.storage
              .from(process.env.SUPABASE_BUCKET)
              .remove([attachment.filePath]);

            if (error) {
              console.error("Supabase delete error:", error.message);
            }
          }
        } catch (err) {
          console.error("Attachment delete error:", err.message);
        }
      }
    }

    // 🔹 Delete task
    await Task.deleteOne({ _id: taskId });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Add a comment to a task
exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { companyId, _id: userId } = req.user;
    const { text } = req.body;

    const task = await Task.findOne({ _id: taskId, companyId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is assigned to the task or has higher privileges
    if (!task.assignees.includes(userId) && req.user.role === "employee") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only comment on your own tasks.",
      });
    }

    task.comments.push({
      userId,
      text,
    });

    await task.save();

    await task.populate([
      { path: "assignees", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "comments.userId", select: "name" },
    ]);

    // ✅ Notifications for assignees except the commenter
    const notifications = task.assignees
      .filter((assignee) => assignee.toString() !== userId.toString())
      .map((assigneeId) => ({
        userId: assigneeId,
        companyId,
        type: "task-updated",
        message: `A new comment was added on task "${task.title}"`,
        relatedEntity: {
          type: "task",
          id: task._id,
        },
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// Upload attachment to a task
exports.uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { companyId, userId } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const task = await Task.findOne({ _id: taskId, companyId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is assigned to the task or has higher privileges
    if (!task.assignees.includes(userId) && req.user.role === "employee") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only add attachments to your own tasks.",
      });
    }

    // Upload file to S3 (or your preferred storage)
    const uploadResult = await uploadToS3(req.file);

    task.attachments.push({
      filename: uploadResult.key,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: userId,
    });

    await task.save();

    // Populate for response
    await task.populate([
      { path: "assignees", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "attachments.uploadedBy", select: "name" },
    ]);

    res.status(200).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading attachment",
      error: error.message,
    });
  }
};

// Delete an attachment from a task
exports.deleteAttachment = async (req, res) => {
  try {
    const { taskId, attachmentId } = req.params;
    const { companyId, userId, role } = req.user;

    const task = await Task.findOne({ _id: taskId, companyId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const attachment = task.attachments.id(attachmentId);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    // Check permissions - only the uploader, admins or managers can delete
    if (attachment.uploadedBy.toString() !== userId && role === "employee") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own attachments.",
      });
    }

    // Delete from storage
    await deleteFromS3(attachment.filename);

    // Remove from task
    task.attachments.pull(attachmentId);
    await task.save();

    // Populate for response
    await task.populate([
      { path: "assignees", select: "name email" },
      { path: "createdBy", select: "name email" },
      { path: "attachments.uploadedBy", select: "name" },
    ]);

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting attachment",
      error: error.message,
    });
  }
};

// Get tasks assigned to the current user
exports.getMyTasks = async (req, res) => {
  try {
    const { companyId, _id } = req.user;
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = "dueDate",
      sortOrder = "asc",
    } = req.query;

    // Build filter object
    const filter = { companyId, assignees: _id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      populate: [
        { path: "assignees", select: "name email" },
        { path: "createdBy", select: "name email" },
      ],
    };

    const tasks = await Task.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your tasks",
      error: error.message,
    });
  }
};
