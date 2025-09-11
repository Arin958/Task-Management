const express = require("express");
const taskRoutes = express.Router();
const {
  getCompanyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
  deleteAttachment,
  getMyTasks,
} = require("../controllers/taskController");

const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware"); // multer for file uploads
const cloudinaryUpload = require("../middleware/upload"); // images
const uploadAll = require("../middleware/uploadAll");



// ✅ All routes require authentication

// Company-level task routes
taskRoutes.get("/", protectRoutes, getCompanyTasks); // Get all company tasks
taskRoutes.post(
  "/createTask",
  protectRoutes,
  uploadAll,
  createTask
); // Create a new task

// User-specific
taskRoutes.get("/my", protectRoutes, getMyTasks); // Tasks assigned to logged-in user

// Single task
taskRoutes.get("/:taskId", protectRoutes, getTask); // Get task by ID
taskRoutes.put(
  "/:taskId",
  protectRoutes,
  uploadAll,
  updateTask
); // Update task
taskRoutes.delete("/:taskId", protectRoutes, deleteTask); // Only admin/manager can delete

// Comments
taskRoutes.post("/:taskId/comments", protectRoutes, addComment);

// Attachments
// router.post(
//   "/:taskId/attachments",
//   upload.single("file"),   // file field name = "file"
//   uploadAttachment
// );
// router.delete("/:taskId/attachments/:attachmentId", deleteAttachment);

module.exports = taskRoutes;
