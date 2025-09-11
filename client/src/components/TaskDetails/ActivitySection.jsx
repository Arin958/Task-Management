import React from "react";
import { User, Paperclip } from "lucide-react";

const ActivitySection = ({ selectedTask }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
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
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visibility
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
              {selectedTask.visibility || "company"}
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
          {selectedTask.attachments && selectedTask.attachments.length > 0 && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-white">
                  <span className="font-medium">
                    {selectedTask.attachments.length}
                  </span>{" "}
                  file{selectedTask.attachments.length !== 1 ? 's' : ''} attached
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(selectedTask.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivitySection;