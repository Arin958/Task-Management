import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchTaskById, deleteTask } from "../store/slices/taskSlice";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchUsers } from "../store/slices/userSlice";
import { toast } from "sonner";
import EditTaskModal from "../components/TaskDetails/EditModalTask";
import TaskHeader from "../components/TaskDetails/TaskHeader";
import TaskInfo from "../components/TaskDetails/TaskInfo";
import AttachmentsSection from "../components/TaskDetails/AttachmentsSection";
import CommentsSection from "../components/TaskDetails/CommentsSection";
import TaskActions from "../components/TaskDetails/TaskActions";
import ActivitySection from "../components/TaskDetails/ActivitySection";

const TaskDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { selectedTask, loading, error } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }
  }, [taskId, dispatch]);

  const handleDeleteTask = () => {
    if (user.role !== "admin") {
      toast.error("You are not authorized to delete tasks.");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      dispatch(deleteTask(selectedTask._id))
        .unwrap()
        .then(() => {
          navigate("/tasks");
          toast.success("Task deleted successfully!");
        })
        .catch((error) => {
          console.error("Failed to delete task:", error);
          setIsDeleting(false);
        });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500 dark:text-blue-400 mb-3" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading task details...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 dark:text-red-400 p-6">
        <AlertCircle className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium mb-4 text-center">{error}</p>
        <button
          onClick={() => dispatch(fetchTaskById(taskId))}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition"
        >
          Try Again
        </button>
      </div>
    );

  if (!selectedTask)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-4 text-center">Task not found</p>
        <Link
          to="/tasks"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Tasks
        </Link>
      </div>
    );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <EditTaskModal
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        selectedTask={selectedTask}
        user={user}
      />

      <TaskHeader
        selectedTask={selectedTask}
        onEdit={() => setIsEditing(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2">
          <TaskInfo selectedTask={selectedTask} />

          <AttachmentsSection selectedTask={selectedTask} />

          <CommentsSection selectedTask={selectedTask} user={user} />
        </div>

        {/* Right Column - Activity & Info */}
        <div className="space-y-6">
          <TaskActions
            selectedTask={selectedTask}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteTask}
            isDeleting={isDeleting}
            user={user}
          />

          <ActivitySection selectedTask={selectedTask} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
