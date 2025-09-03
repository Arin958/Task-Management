import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { PRIORITY_COLORS } from "./constants";
import { FaClipboard } from "react-icons/fa";
import TeamMembers from "./TeamMembers";
import { tasks } from "../../assets/data";

const TaskCard = ({ task }) => {

  const navigate = useNavigate();
 

  const handleClick = () => {
    navigate(`/tasks/${task._id}`); // assuming task has `_id` as identifier
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{task.title}</h3>
        <span
          className={`text-xs font-medium py-1 px-2 rounded-full ${PRIORITY_COLORS[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {task.subTasks.length > 0 ? task.subTasks[0].title : "No description"}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <FiCalendar className="text-base" />
          <span>{new Date(task.date).toLocaleDateString()}</span>
        </div>
        <TeamMembers team={task.team} />
      </div>

      {task.assets.length > 0 && (
        <div className="flex items-center gap-1 mt-3 text-gray-500 dark:text-gray-400">
          <FaClipboard className="text-sm" />
          <span className="text-xs">
            {task.assets.length} attachment
            {task.assets.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
