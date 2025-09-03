// TaskDetails.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchTaskById,
  addComment,
  updateTask,
  deleteTask,
} from "../store/slices/taskSlice";
import {
  Loader2,
  User,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  CheckSquare,
  List,
  ArrowLeft,
  Edit,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  MoreVertical,
  ThumbsUp,
  Smile,
  Image,
  FileText,
  Trash2,
  X,
} from "lucide-react";
import { fetchUsers } from "../store/slices/userSlice";
import { toast } from "sonner";

const TaskDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { selectedTask, loading, error } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    assignees: [],
    progress: 0,
  });

  // Get all users for assignee selection
  const { teams } = useSelector((state) => state.user || { users: [] });
  console.log(teams);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }
  }, [taskId, dispatch]);

  // Update edit form when task data changes
  useEffect(() => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        assignees: selectedTask.assignees
          ? selectedTask.assignees.map((a) => a._id || a)
          : [],
        progress: selectedTask.progress || 0,
      });
    }
  }, [selectedTask]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(
        addComment({
          taskId,
          comment: {
            text: newComment,
            user: {
              _id: user._id,
              name: user.name,
              avatar: user.avatar,
            },
          },
        })
      );
      setNewComment("");
    }
  };

  const handleMarkAsComplete = () => {
    if (selectedTask.status !== "completed") {
      dispatch(
        updateTask({
          taskId: selectedTask._id,
          updates: { status: "completed" },
        })
      );
    }
  };

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updates = {
      ...editForm,
      // Convert date string to proper format if needed
      dueDate: editForm.dueDate
        ? new Date(editForm.dueDate).toISOString()
        : selectedTask.dueDate,
    };

    dispatch(
      updateTask({
        taskId: selectedTask._id,
        updates,
      })
    
    )
      .unwrap()
      .then(() => {
        setIsEditing(false);
        toast.success("Task updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        assignees: selectedTask.assignees
          ? selectedTask.assignees.map((a) => a._id || a)
          : [],
        progress: selectedTask.progress || 0,
      });
    }
  };

  const handleDeleteTask = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      dispatch(deleteTask(selectedTask._id))
        .unwrap()
        .then(() => {
          navigate("/tasks");
          toast.success("Task deleted successfully!");
        })
        .catch((error) => {
          console.error("Failed to delete task:", error);
          setIsDeleting(false);
        });
    }
  };

  const handleAssigneeChange = (userId) => {
    const newAssignees = editForm.assignees.includes(userId)
      ? editForm.assignees.filter((id) => id !== userId)
      : [...editForm.assignees, userId];

    setEditForm({ ...editForm, assignees: newAssignees });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <CheckSquare className="w-5 h-5 text-green-500 dark:text-green-400" />
        );
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      default:
        return <List className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500 dark:text-blue-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading task details...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 dark:text-red-400">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={() => dispatch(fetchTaskById(taskId))}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition"
        >
          Try Again
        </button>
      </div>
    );

  if (!selectedTask)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-lg text-gray-600">Task not found</p>
        <Link
          to="/tasks"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Tasks
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Edit Task Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Task
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows="4"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) =>
                        setEditForm({ ...editForm, dueDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm({ ...editForm, priority: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {editForm.status === "in-progress" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Progress ({editForm.progress}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editForm.progress}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            progress: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assignees
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700">
                    {teams.length > 0 ? (
                      teams.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={editForm.assignees.includes(user._id)}
                            onChange={() => handleAssigneeChange(user._id)}
                            className="mr-2"
                            id={`assignee-${user._id}`}
                          />
                          <label
                            htmlFor={`assignee-${user._id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {user.name} ({user.email})
                          </label>
                        </div>
                      ))
                    ) : (
                      <p>No assignees found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          to="/tasks"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Tasks
        </Link>
        <button
          onClick={handleEditTask}
          className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition ml-auto"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedTask.title}
              </h1>
              <div className="flex items-center">
                {getStatusIcon(selectedTask.status)}
                <span
                  className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedTask.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due Date
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {new Date(selectedTask.dueDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Flag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Priority
                  </p>
                  <p
                    className={`font-medium ${
                      selectedTask.priority === "high"
                        ? "text-red-600 dark:text-red-400"
                        : selectedTask.priority === "medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {selectedTask?.priority?.charAt(0).toUpperCase() +
                      selectedTask.priority?.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created By
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {selectedTask.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white capitalize">
                    {selectedTask.status}
                  </p>
                </div>
              </div>
            </div>

            {selectedTask.assignees?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                  Assigned To
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.assignees.map((assignee) => (
                    <span
                      key={assignee._id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {assignee.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedTask.status === "in-progress" &&
              selectedTask.progress !== undefined && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                    Progress
                  </h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedTask.progress}% complete
                  </p>
                </div>
              )}

            {/* Attachments Section */}
            {selectedTask.attachments &&
              selectedTask.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {selectedTask.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {attachment.name}
                        </span>
                        <a
                          href={attachment.url}
                          download
                          className="ml-auto text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comments
            </h2>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows="3"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <Image className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {selectedTask.comments && selectedTask.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedTask.comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {comment.userId?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 dark:text-white">
                            {comment.userId?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt || new Date())}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <button className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Like
                        </button>
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Activity & Info */}
        <div className="space-y-6">
          {/* Task Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Task Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleMarkAsComplete}
                disabled={selectedTask.status === "completed"}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                {selectedTask.status === "completed"
                  ? "Completed"
                  : "Mark as Complete"}
              </button>
              <button
                onClick={handleEditTask}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Task"}
              </button>
            </div>
          </div>

          {/* Task Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Task Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created At
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatDate(selectedTask.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {formatDate(selectedTask.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Task ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white break-all">
                  {selectedTask._id}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-white">
                    <span className="font-medium">You</span> created this task
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(selectedTask.createdAt)}
                  </p>
                </div>
              </div>
              {selectedTask.assignees?.length > 0 && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      <span className="font-medium">
                        {selectedTask.assignees[0].name}
                      </span>{" "}
                      was assigned to this task
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(selectedTask.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
