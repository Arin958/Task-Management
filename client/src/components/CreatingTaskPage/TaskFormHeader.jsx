import { Plus } from "lucide-react";

const TaskFormHeader = () => {
  return (
    <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm mr-3">
          <Plus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Create New Task</h1>
          <p className="mt-1 text-blue-100 dark:text-blue-200 opacity-90">
            Add a new task to your project management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskFormHeader;