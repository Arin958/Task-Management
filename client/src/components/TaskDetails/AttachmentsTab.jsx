import React from "react";
import { FiPaperclip } from "react-icons/fi";

const AttachmentsTab = ({ task }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Attachments</h3>
      {task.assets && task.assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {task.assets.map(asset => (
            <div key={asset._id} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                <FiPaperclip className="text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{asset.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{asset.size}</p>
              </div>
              <a
                href={asset.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No attachments</p>
      )}
    </div>
  );
};

export default AttachmentsTab;