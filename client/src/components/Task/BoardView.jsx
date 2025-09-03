import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks, filterStatus = null }) => {
  // Define columns based on whether we're filtering or showing all
 const columns = filterStatus
  ? [{
      id: filterStatus,
      title: 
        filterStatus === "todo" 
          ? "Todo" 
          : filterStatus === "in progress" 
            ? "In Progress" 
            : "Completed",
      color: 
        filterStatus === "todo" 
          ? "blue" 
          : filterStatus === "in progress" 
            ? "yellow" 
            : "green",
    }]
  : [
      { id: "todo", title: "Todo", color: "blue" },
      { id: "in progress", title: "In Progress", color: "yellow" },
      { id: "completed", title: "Completed", color: "green" }
    ];

     

      
  return (
    <div className={`grid ${filterStatus ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
      {columns.map(column => {
        const columnTasks = tasks.filter(task => task.stage === column.id);
        console.log(columnTasks);
        
        
        return (
          <div key={column.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${column.color}-600`}></div>
                {column.title}
              </h2>
              <span className="bg-gray-200 dark:bg-gray-700 text-xs font-medium py-1 px-2 rounded-full">
                {columnTasks.length}
              </span>
            </div>
            
            {columnTasks.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
            
            {columnTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks in this category
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;