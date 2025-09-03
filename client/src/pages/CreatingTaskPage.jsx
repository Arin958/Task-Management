import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../store/slices/taskSlice";
import { Loader2, Calendar, AlertCircle, User, Plus, ChevronDown, X, Check } from "lucide-react";
import { fetchUsers } from "../store/slices/userSlice";
import { toast } from "sonner";

const CreatingTaskPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.task);
  const { teams } = useSelector((state) => state.user);

  // Local form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignees: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFocused, setIsFocused] = useState({});
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(user.companyId));
  }, [dispatch, user.companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setIsFocused((prev) => ({ ...prev, [name]: false }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.trim().length < 3) error = "Title must be at least 3 characters";
        break;
      case "dueDate":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) error = "Due date cannot be in the past";
        }
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const toggleAssignee = (userId) => {
    setFormData((prev) => {
      if (prev.assignees.includes(userId)) {
        return {
          ...prev,
          assignees: prev.assignees.filter(id => id !== userId)
        };
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, userId]
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      dispatch(createTask(formData));
      toast.success("Task created successfully!");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
      case "high": return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800";
      case "critical": return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800";
      default: return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
      case "in-progress": return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
      case "review": return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800";
      case "completed": return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800";
      default: return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const removeAssignee = (userId, e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter(id => id !== userId)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Removed overflow-hidden from this container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm mr-3">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create New Task</h1>
                <p className="mt-1 text-blue-100 dark:text-blue-200 opacity-90">Add a new task to your project management system</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => handleFocus('title')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.title && touched.title 
                      ? "border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/30" 
                      : isFocused.title 
                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/30" 
                        : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 outline-none`}
                  placeholder="Enter task title"
                />
              </div>
              {errors.title && touched.title && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => handleFocus('description')}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isFocused.description 
                      ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/30" 
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 outline-none`}
                  placeholder="Describe the task details, requirements, and objectives..."
                  rows="4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none transition-all duration-200 outline-none ${getStatusColor(formData.status)} pr-10`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 appearance-none transition-all duration-200 outline-none pr-10 ${getPriorityColor(formData.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  onFocus={() => handleFocus('dueDate')}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.dueDate && touched.dueDate 
                      ? "border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900/30" 
                      : isFocused.dueDate 
                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/30" 
                        : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none`}
                />
              </div>
              {errors.dueDate && touched.dueDate && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Assignees - Fixed Version */}
            {(user?.role === "admin" ||
              user?.role === "manager" ||
              user?.role === "superadmin") && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Assign To
                </label>
                
                {/* Selected assignees chips */}
                {formData.assignees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.assignees.map(userId => {
                      const user = teams.find(member => member._id === userId);
                      return user ? (
                        <div key={userId} className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm">
                          <span>{user.name}</span>
                          <button 
                            type="button"
                            onClick={(e) => removeAssignee(userId, e)}
                            className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                {/* Custom dropdown select */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100 flex items-center justify-between transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    <span>Select team members</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAssigneeDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {teams.map((member) => (
                        <div
                          key={member._id}
                          onClick={() => toggleAssignee(member._id)}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 ${
                            formData.assignees.includes(member._id) 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' 
                              : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                          </div>
                          {formData.assignees.includes(member._id) && (
                            <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click to select team members. Selected members will appear above.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error creating task
                  </h3>
                </div>
                <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm dark:shadow-gray-900/30 transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatingTaskPage;