import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(() => {
    return (
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (location.pathname === "/login") {
    return <Outlet />;
  }

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: "Dashboard" },
    { path: "/tasks", icon: ClipboardDocumentCheckIcon, label: "Tasks" },
    { path: "/team", icon: UserGroupIcon, label: "Team" },
    { path: "/trash", icon: TrashIcon, label: "Trash" },
  ];

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          navItems={navItems}
          location={location}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
