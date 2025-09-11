import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi"; // Bell icon from react-icons
import { useDispatch, useSelector } from "react-redux";
import NotificationModal from "../NotificationModal";
import { fetchNotifications } from "../../store/slices/notificationSlice";

const Header = ({ sidebarOpen, navItems, location }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const {notifications} = useSelector((state) => state.notification);

   useEffect(() => {
      
        dispatch(fetchNotifications(user.id));
      
    }, [dispatch, user?.id]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        {/* Page Title */}
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
          {navItems.find((item) => location.pathname.startsWith(item.path))
            ?.label || ""}
        </h2>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Bell Icon */}
         <button onClick ={() => setIsNotificationOpen(true)} className="relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <FiBell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                    {notifications.filter(notification => notification.isRead === false).length}

                  </span>
                )}
              </button>

          {/* User Avatar + Name */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-300 font-medium">
                {user?.name.charAt(0)}
              </span>
            </div>
            {sidebarOpen && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            )}
                <NotificationModal 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
          />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
