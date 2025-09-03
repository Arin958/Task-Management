import React, { useEffect, useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
  UserGroupIcon,
  XMarkIcon,
  Bars3Icon,
  ClipboardDocumentListIcon,
  PencilIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaDoorOpen, FaRunning } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { toast } from "sonner";
import { persistor } from "../../store/store";
import { FiUser } from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar by default on mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [setSidebarOpen]);

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Dashboard" },
    { path: "/tasks", icon: ClipboardDocumentCheckIcon, label: "Tasks" },
    {
      path: "/tasks/completed",
      icon: ClipboardDocumentListIcon,
      label: "Completed Task",
    },
    { path: "/tasks/in-progress", icon: FaRunning, label: "In Progress" },
    { path: "/tasks/todo", icon: PencilIcon, label: "To Do Task" },
    { path: "/team", icon: UserGroupIcon, label: "Team" },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      await persistor.purge();
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed!");
    }
  };

  // Responsive sidebar behavior
  const getSidebarClasses = () => {
    if (isMobile) {
      return sidebarOpen ? "w-72 fixed inset-y-0 left-0 z-50" : "hidden";
    }
    return sidebarOpen ? "w-72" : "w-24";
  };

  // Icon sizing based on device and state
  const getIconSize = () => {
    return "w-5 h-5";
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Logout
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout? Any unsaved changes may be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile toggle button (only shows on mobile) */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${getSidebarClasses()} transition-all duration-300 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-full flex-shrink-0`}
      >
        <div className="flex flex-col h-full p-3 md:p-4">
          {/* Logo/Sidebar Toggle */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                TaskFlow
              </h1>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <ArrowLeftOnRectangleIcon
                  className={`${getIconSize()} text-gray-500 dark:text-gray-400 ${
                    !sidebarOpen && "transform rotate-180"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-3 md:space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      } ${sidebarOpen ? "px-4" : "justify-center"}`}
                      title={item.label}
                    >
                      <Icon
                        className={`${getIconSize()} ${
                          sidebarOpen ? "mr-3" : ""
                        }`}
                      />
                      {sidebarOpen && (
                        <span className="text-base font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Settings */}
          <div className="mt-auto space-y-3 md:space-y-4">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-full p-3 rounded-lg transition-all ${
                sidebarOpen ? "px-4" : "justify-center"
              } text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? (
                <SunIcon className={getIconSize()} />
              ) : (
                <MoonIcon className={getIconSize()} />
              )}
              {sidebarOpen && (
                <span className="ml-3 text-base font-medium">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
             <Link
              to="/profile"
              className={`flex items-center p-3 rounded-lg transition-all ${
                sidebarOpen ? "px-4" : "justify-center"
              } text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`}
              title="Profile"
            >
              <FiUser className={getIconSize()} />
              {sidebarOpen && (
                <span className="ml-3 text-base font-medium">My Profile</span>
              )}
            </Link>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center w-full p-3 rounded-lg transition-all ${
                sidebarOpen ? "px-4" : "justify-center"
              } text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`}
              title="Logout"
            >
              <FaDoorOpen className={getIconSize()} />
              {sidebarOpen && (
                <span className="ml-3 text-base font-medium">Logout</span>
              )}
            </button>

           
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;