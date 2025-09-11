import React from "react";
import { Calendar, Flag, User, CheckCircle2 } from "lucide-react";

const TaskInfo = ({ selectedTask }) => {
  const getPriorityColor = (priority) => {
    // Add a default case for undefined/null priority
    if (!priority) return "text-gray-600 dark:text-gray-400";
    
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (status) => {
    // Add a default case for undefined/null status
    if (!status) return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Safely get values with defaults
  const priority = selectedTask.priority || "not set";
  const status = selectedTask.status || "not set";
  const progress = selectedTask.progress || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white break-words">
          {selectedTask.title}
        </h1>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
            {status}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
            {priority}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">
        {selectedTask.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "No due date"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Flag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
            <p className={`font-medium ${getPriorityColor(priority)}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {selectedTask.createdBy?.name || "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium text-gray-800 dark:text-white capitalize">
              {status}
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

      {selectedTask.status === "in-progress" && progress !== undefined && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Progress
          </h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
            {progress}% complete
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskInfo;