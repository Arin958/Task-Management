import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCompanyTasks } from "../store/slices/taskSlice";
import {
  Loader2,
  User,
  Calendar,
  Flag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Plus,
  AlertCircle,
  Clock,
  CheckSquare,
  List,
} from "lucide-react";

const Task = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, error, page, totalPages } = useSelector(
    (state) => state.task
  );
  const { status } = useParams();

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Reset filters when URL status changes
  useEffect(() => {
    // Reset filters when navigating between status pages
    setFilters({
      status: status || "all",
      priority: "all",
      search: "",
    });
    
    // Close filter panel when status changes
    setIsFilterOpen(false);
  }, [status]);

  useEffect(() => {
    if (user?.companyId) {
      const fetchParams = {
        page: 1,
        limit: 9,
      };
      
      // Only add status filter if it's not "all"
      if (status && status !== "all") {
        fetchParams.status = status;
      }
      
      dispatch(fetchCompanyTasks(fetchParams)).then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [user?.companyId, status, dispatch]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    
    setFilters(newFilters);
    
    // Only fetch if it's not the initial load
    if (!isInitialLoad) {
      const fetchParams = {
        page: 1,
        limit: 9,
      };
      
      // Add filters only if they're not "all"
      if (newFilters.status !== "all") {
        fetchParams.status = newFilters.status;
      }
      
      if (newFilters.priority !== "all") {
        fetchParams.priority = newFilters.priority;
      }
      
      if (newFilters.search) {
        fetchParams.search = newFilters.search;
      }
      
      dispatch(fetchCompanyTasks(fetchParams));
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      search: "",
    });
    
    dispatch(fetchCompanyTasks({
      page: 1,
      limit: 9,
    }));
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks?.docs
    ? tasks.docs.filter((task) => {
        // Status filter
        if (filters.status !== "all" && task.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== "all" && task.priority !== filters.priority) {
          return false;
        }

        // Search filter
        if (
          filters.search &&
          !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
    : [];

  const getPageTitle = () => {
    if (status === "completed") return "Completed Tasks";
    if (status === "in-progress") return "Tasks In Progress";
    if (status === "todo") return "To-Do Tasks";
    return "Company Tasks";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <CheckSquare className="w-4 h-4 text-green-500 dark:text-green-400" />
        );
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      default:
        return <List className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  // Show loading only for the initial load or when explicitly loading
  if (loading && isInitialLoad)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500 dark:text-blue-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading tasks...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 dark:text-red-400">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={() => {
            setIsInitialLoad(true);
            dispatch(fetchCompanyTasks({ page: 1, limit: 9 }));
          }}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          {getPageTitle()}
        </h2>
        <button onClick={() => navigate('/creating-task-page')} className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition">
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <button
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          
          {(filters.status !== "all" || filters.priority !== "all" || filters.search) && (
            <button
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Show loading spinner when filtering */}
      {loading && !isInitialLoad && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500 dark:text-blue-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Filtering tasks...</span>
        </div>
      )}

      {/* Task Grid */}
      {filteredTasks.length === 0 && !loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filters.status !== "all" || filters.priority !== "all" || filters.search
              ? "Try adjusting your filters to see more results."
              : "Get started by creating a new task."}
          </p>
          {(filters.status !== "all" || filters.priority !== "all" || filters.search) && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <div
              onClick={() => handleTaskClick(task._id)}
              key={task._id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/40 transition-all duration-200 cursor-pointer"
            >
              {/* Title + Status */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-1">
                  {task.title}
                </h3>
                <div className="flex items-center">
                  {getStatusIcon(task.status)}
                  <span
                    className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {task.description}
              </p>

              {/* Meta info */}
              <div className="space-y-2.5 text-sm">
                {/* Due date */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span
                    className={`font-medium ${
                      task.priority === "high"
                        ? "text-red-600 dark:text-red-400"
                        : task.priority === "medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {task?.priority?.charAt(0).toUpperCase() +
                      task?.priority?.slice(1)}{" "}
                    Priority
                  </span>
                </div>

                {/* Created By */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="truncate">
                    By: {task.createdBy?.name || "Unknown"}
                  </span>
                </div>

                {/* Assignees */}
                {task.assignees?.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">
                      Assigned to:{" "}
                      {task.assignees.map((a) => a.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for in-progress tasks */}
              {task.status === "in-progress" && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{task.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {tasks?.docs?.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.totalCount} tasks
            {status && ` (Filtered by: ${status})`}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() =>
                dispatch(fetchCompanyTasks({ page: page - 1, limit: 9 }))
              }
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() =>
                      dispatch(fetchCompanyTasks({ page: pageNum, limit: 9 }))
                    }
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                dispatch(fetchCompanyTasks({ page: page + 1, limit: 9 }))
              }
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;