import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../../store/slices/taskSlice";
import { X } from "lucide-react";
import { toast } from "sonner";

const EditTaskModal = ({ isEditing, setIsEditing, selectedTask , user}) => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.user || { users: [] });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    assignees: [],
    progress: 0,
  });

  useEffect(() => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        assignees: selectedTask.assignees
          ? selectedTask.assignees.map((a) => a._id || a)
          : [],
        progress: selectedTask.progress || 0,
      });
    }
  }, [selectedTask]);

  const handleSaveEdit = () => {
    if(user.role !== "admin" && user.role !== "manager") {
      toast.error("You are not authorized to update tasks.");
      return;
    }
    const updates = {
      ...editForm,
      dueDate: editForm.dueDate
        ? new Date(editForm.dueDate).toISOString()
        : selectedTask.dueDate,
    };

    dispatch(
      updateTask({
        taskId: selectedTask._id,
        updates,
      })
    )
      .unwrap()
      .then(() => {
        setIsEditing(false);
        toast.success("Task updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
          : "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        assignees: selectedTask.assignees
          ? selectedTask.assignees.map((a) => a._id || a)
          : [],
        progress: selectedTask.progress || 0,
      });
    }
  };

  const handleAssigneeChange = (userId) => {
    const newAssignees = editForm.assignees.includes(userId)
      ? editForm.assignees.filter((id) => id !== userId)
      : [...editForm.assignees, userId];

    setEditForm({ ...editForm, assignees: newAssignees });
  };

  if (!isEditing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Edit Task
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows="4"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {editForm.status === "in-progress" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Progress ({editForm.progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editForm.progress}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        progress: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignees
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700">
                {teams.length > 0 ? (
                  teams.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={editForm.assignees.includes(user._id)}
                        onChange={() => handleAssigneeChange(user._id)}
                        className="mr-2"
                        id={`assignee-${user._id}`}
                      />
                      <label
                        htmlFor={`assignee-${user._id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {user.name} ({user.email})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 p-2">No users found</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;