import React from "react";
import { FiPlus } from "react-icons/fi";

const Header = ({ title = "All Tasks", filterStatus = null }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {filterStatus 
            ? `Viewing ${filterStatus} tasks` 
            : "Manage your team's tasks and projects"}
        </p>
      </div>
      
      <button className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
        <FiPlus className="text-lg" />
        Create Task
      </button>
    </div>
  );
};

export default Header;