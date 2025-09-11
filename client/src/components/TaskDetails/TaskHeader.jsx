import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

const TaskHeader = ({ selectedTask, onEdit }) => {
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



  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-3">
      <Link
        to="/tasks"
        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Tasks
      </Link>
      <div className="flex-1"></div>
      <button
        onClick={onEdit}
        className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Task
      </button>
    </div>
  );
};

export default TaskHeader;