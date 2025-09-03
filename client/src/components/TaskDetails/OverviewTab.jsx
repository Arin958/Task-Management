import React from "react";
import { FiCalendar } from "react-icons/fi";
import { PRIORITY_COLORS } from "../Task/constants";

const OverviewTab = ({ task }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Information</h3>
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</span>
            <span className="text-gray-800 dark:text-white flex items-center">
              <FiCalendar className="mr-2" /> {formatDate(task.date)}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Priority</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
            <span className="text-gray-800 dark:text-white">
              {task.status === "completed" ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Team Members</h3>
        <div className="space-y-3">
          {task.team && task.team.length > 0 ? (
            task.team.map(member => (
              <div key={member._id} className="flex items-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No team members assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;