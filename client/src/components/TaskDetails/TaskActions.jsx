import React from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../store/slices/taskSlice";
import { CheckSquare, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const TaskActions = ({ selectedTask, onEdit, onDelete, isDeleting, user }) => {
  const dispatch = useDispatch();

  const handleMarkAsComplete = () => {
    if (user.role !== "admin" && user.role !== "manager") {
      toast.error("You are not authorized to mark tasks as complete.");
      return;
    }

    if (selectedTask.status !== "completed") {
      dispatch(
        updateTask({
          taskId: selectedTask._id,
          updates: { status: "completed" },
        })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-5">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Task Actions
      </h3>
      <div className="space-y-2">
        <button
          onClick={handleMarkAsComplete}
          disabled={selectedTask.status === "completed"}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          {selectedTask.status === "completed"
            ? "Completed"
            : "Mark as Complete"}
        </button>
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Task
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskActions;
