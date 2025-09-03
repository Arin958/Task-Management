import React from "react";
import { FiClock, FiEdit, FiTrash2 } from "react-icons/fi";
import { PRIORITY_COLORS } from "../Task/constants";

const TaskHeader = ({ task }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FiClock className="mr-1" /> Created {formatDate(task.date)}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{task.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{task.description || "No description available."}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiEdit size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;