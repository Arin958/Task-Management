import React from "react";

const TaskTabs = ({ activeTab, setActiveTab, task }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
            activeTab === "overview"
              ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("subtasks")}
          className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
            activeTab === "subtasks"
              ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Subtasks ({task.subTasks?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
            activeTab === "comments"
              ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Comments ({task.comments?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("attachments")}
          className={`py-4 px-6 text-center font-medium text-sm border-b-2 ${
            activeTab === "attachments"
              ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Attachments ({task.assets?.length || 0})
        </button>
      </nav>
    </div>
  );
};

export default TaskTabs;