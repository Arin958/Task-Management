// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { 
  FaCheckCircle, 
  FaTasks, 
  FaClipboardList,
  FaExclamationTriangle,
  FaUserTie,
  FaRegClock,
  FaRegCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaCrown,
  FaCalendarTimes
} from "react-icons/fa";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyDetails } from "../store/slices/companySlice";
import { fetchUsers } from "../store/slices/userSlice";
import { fetchForBosss, fetchForEmployee } from "../store/slices/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { company } = useSelector(state => state.company);
  const { teams } = useSelector(state => state.user);
  const { boss, employee, loading, error } = useSelector(state => state.dashboard);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
      
      if (user.role === "admin") {
        dispatch(fetchForBosss());
      } else {
        dispatch(fetchForEmployee());
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Set default empty structure if no data
    const emptyData = {
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        highPriorityTasks: 0,
        totalEmployees: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        reviewTasks: 0
      },
      overdueTasks: [],
      recentTasks: [],
      assignedTasks: [],
      teamMembers: []
    };

    if (userRole === "admin") {
      setDashboardData(boss || emptyData);
    } else if (userRole !== "admin") {
      setDashboardData(employee || emptyData);
    }
  }, [boss, employee, userRole]);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(getCompanyDetails(user.companyId));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchUsers());
    }
  }, [user, dispatch]);

  // Show loading only if we're actively fetching data
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  // Show error if there is one
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  // Ensure dashboardData is never null
  const data = dashboardData || {
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      highPriorityTasks: 0,
      totalEmployees: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      reviewTasks: 0
    },
    overdueTasks: [],
    recentTasks: [],
    assignedTasks: [],
    teamMembers: []
  };

  // Stats configuration based on user role
  const getStats = () => {
    if (userRole === "admin") {
      return [
        {
          _id: "1",
          label: "TOTAL TASKS",
          total: data.stats.totalTasks || 0,
          icon: <FaTasks className="text-2xl" />,
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400"
        },
        {
          _id: "2",
          label: "COMPLETED TASKS",
          total: data.stats.completedTasks || 0,
          icon: <FaCheckCircle className="text-2xl" />,
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400"
        },
        {
          _id: "3",
          label: "HIGH PRIORITY",
          total: data.stats.highPriorityTasks || 0,
          icon: <FaExclamationTriangle className="text-2xl" />,
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400"
        },
        {
          _id: "4",
          label: "TOTAL EMPLOYEES",
          total: data.stats.totalEmployees || 0,
          icon: <FaUsers className="text-2xl" />,
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400"
        }
      ];
    } else {
      return [
        {
          _id: "1",
          label: "ASSIGNED TASKS",
          total: data.stats.totalTasks || 0,
          icon: <FaTasks className="text-2xl" />,
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400"
        },
        {
          _id: "2",
          label: "COMPLETED TASKS",
          total: data.stats.completedTasks || 0,
          icon: <FaCheckCircle className="text-2xl" />,
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400"
        },
        {
          _id: "3",
          label: "HIGH PRIORITY",
          total: data.stats.highPriorityTasks || 0,
          icon: <FaExclamationTriangle className="text-2xl" />,
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400"
        },
        {
          _id: "4",
          label: "TO DO TASKS",
          total: data.stats.todoTasks || 0,
          icon: <FaClipboardList className="text-2xl" />,
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-600 dark:text-amber-400"
        }
      ];
    }
  };


  const priorityIcons = {
    high: <FaExclamationTriangle className="text-red-500 dark:text-red-400" />,
    medium: <FaExclamationTriangle className="text-yellow-500 dark:text-yellow-400" />,
    low: <FaExclamationTriangle className="text-blue-500 dark:text-blue-400" />
  };

  const statusBadges = {
    todo: <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-1 rounded">To Do</span>,
    "in progress": <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-1 rounded">In Progress</span>,
    review: <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded">Review</span>,
    completed: <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded">Completed</span>
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, YYYY");
  };

  const isOverdue = (dueDate) => {
    return moment(dueDate).isBefore(moment(), 'day');
  };

  return (
   <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name} • {company?.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            userRole === "admin" 
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" 
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}>
            {userRole === "admin" ? <FaCrown className="mr-1" /> : <FaUserTie className="mr-1" />}
            {userRole === "admin" ? "Administrator" : "Employee"}
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {getStats().map((stat) => (
          <div 
            key={stat._id} 
            className={`p-4 rounded-lg shadow-sm border ${stat.bg} border-gray-200 dark:border-gray-700`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 dark:text-white">{stat.total}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.text}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks & Overdue Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Tasks Section */}
          {(data.overdueTasks && data.overdueTasks.length > 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-800/50 p-4">
              <div className="flex items-center mb-4">
                <FaCalendarTimes className="text-red-500 dark:text-red-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Overdue Tasks</h2>
                <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-1 rounded">
                  {data.overdueTasks.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {data.overdueTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task._id} 
                    className="border-b pb-4 last:border-b-0 last:pb-0 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {statusBadges[task.status]}
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {priorityIcons[task.priority]}
                            <span className="ml-1 capitalize">{task.priority}</span>
                          </div>
                          <span className="text-sm text-red-500 dark:text-red-400">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {data.overdueTasks.length > 3 && (
                <button className="w-full mt-4 text-sm text-red-600 dark:text-red-400 font-medium py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                  View all overdue tasks ({data.overdueTasks.length})
                </button>
              )}
            </div>
          )}
          
          {/* Recent Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {userRole === "admin" ? "Recent Tasks" : "My Tasks"}
              </h2>
              <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">View All</span>
            </div>
            
            <div className="space-y-4">
              {(userRole === "admin" ? data.recentTasks : data.assignedTasks)
                ?.slice(0, 5)
                .map((task) => (
                <div 
                  key={task._id} 
                  className="border-b pb-4 last:border-b-0 last:pb-0 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {statusBadges[task.status]}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {priorityIcons[task.priority]}
                          <span className="ml-1 capitalize">{task.priority}</span>
                        </div>
                        <span className={`text-sm ${
                          isOverdue(task.dueDate) 
                            ? "text-red-500 dark:text-red-400" 
                            : "text-gray-500 dark:text-gray-400"
                        }`}>
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {((userRole === "admin" && data.recentTasks?.length === 0) || 
              (userRole !== "admin" && data.assignedTasks?.length === 0)) && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No tasks found
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Team Members Section - Only for admin */}
          {userRole === "admin" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Team Members</h2>
                <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">View All</span>
              </div>
              
              <div className="space-y-3">
                {data.teamMembers?.slice(0, 5).map((member) => (
                  <div 
                    key={member._id} 
                    className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                      {member.name ? member.name.charAt(0).toUpperCase() : <FaUserTie />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-white truncate">{member.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.role || "Employee"}</p>
                    </div>
                  </div>
                ))}
                
                {(!data.teamMembers || data.teamMembers.length === 0) && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No team members found
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Task Status Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Status</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">To Do</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{data.stats.todoTasks || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${((data.stats.todoTasks || 0) / (data.stats.totalTasks || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{data.stats.inProgressTasks || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${((data.stats.inProgressTasks || 0) / (data.stats.totalTasks || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Review</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{data.stats.reviewTasks || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${((data.stats.reviewTasks || 0) / (data.stats.totalTasks || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{data.stats.completedTasks || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${((data.stats.completedTasks || 0) / (data.stats.totalTasks || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;