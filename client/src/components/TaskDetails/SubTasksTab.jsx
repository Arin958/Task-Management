import React from "react";
import { FiCheck } from "react-icons/fi";

const SubtasksTab = ({ task, toggleSubtask }) => {
  const calculateProgress = () => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const completed = task.subTasks.filter(st => st.completed).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subtasks</h3>
      {task.subTasks && task.subTasks.length > 0 ? (
        <>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Subtasks list */}
          <div className="space-y-3">
            {task.subTasks.map(subTask => (
              <div 
                key={subTask._id} 
                className={`flex items-center p-3 rounded-lg border ${
                  subTask.completed 
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50" 
                    : "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                }`}
              >
                <button
                  onClick={() => toggleSubtask(subTask._id)}
                  className={`flex items-center justify-center w-5 h-5 rounded-full border mr-3 ${
                    subTask.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 dark:border-gray-500"
                  }`}
                >
                  {subTask.completed && <FiCheck size={12} />}
                </button>
                <span className={subTask.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}>
                  {subTask.title}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No subtasks</p>
      )}
    </div>
  );
};

export default SubtasksTab;