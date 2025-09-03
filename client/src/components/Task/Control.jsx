import React from "react";
import { FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiPaperclip, FiList } from "react-icons/fi";

const Controls = ({
  selectedTab,
  setSelectedTab,
  searchTerm,
  setSearchTerm,
  sortBy,
  sortOrder,
  showSortOptions,
  setShowSortOptions,
  handleSortChange,
  tabs,
  sortOptions
}) => {
  
  const renderIcon = (iconName) => {
    switch(iconName) {
      case "FiPaperclip":
        return <FiPaperclip className="text-xl" />;
      case "FiList":
        return <FiList className="text-xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full md:w-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(tab.value)}
            className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedTab === tab.value ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:opacity-80"}`}
          >
            {renderIcon(tab.icon)}
            {tab.title}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="flex items-center gap-2 w-full sm:w-auto py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <FiFilter className="text-gray-400" />
            <span>Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            {sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {showSortOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === option.value ? "text-blue-600 dark:text-blue-400" : ""}`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.value && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;