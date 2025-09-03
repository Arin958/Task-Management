import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  FiBell, FiX, FiMessageSquare, FiCheckCircle, FiAlertCircle, 
  FiCalendar, FiUser, FiStar, FiClipboard, FiClock 
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../store/slices/notificationSlice';

const NotificationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { notifications, isLoading } = useSelector(state => state.notification);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications(user.id));
    }
  }, [dispatch, user?.id, isOpen]);

  const markAsRead = (notificationId) => {
    try {
      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = () => {
    // Implementation for marking all as read
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markAsRead(notification._id);
      }
    });
  };

  const clearAll = () => {
    // Implementation for clearing all notifications
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'task-assigned':
        return <FiClipboard className="text-blue-500" size={18} />;
      case 'message':
        return <FiMessageSquare className="text-indigo-500" size={18} />;
      case 'alert':
        return <FiAlertCircle className="text-red-500" size={18} />;
      case 'event':
        return <FiCalendar className="text-green-500" size={18} />;
      case 'mention':
        return <FiUser className="text-purple-500" size={18} />;
      case 'achievement':
        return <FiStar className="text-yellow-500" size={18} />;
      default:
        return <FiBell className="text-gray-500" size={18} />;
    }
  };

  const getNotificationTitle = (type) => {
    switch(type) {
      case 'task-assigned':
        return 'Task Assigned';
      case 'message':
        return 'New Message';
      case 'alert':
        return 'Alert';
      case 'event':
        return 'Event';
      case 'mention':
        return 'Mention';
      case 'achievement':
        return 'Achievement';
      default:
        return 'Notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay with backdrop blur */}
      <div 
        className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-all duration-300" 
        onClick={onClose} 
      />
      
      {/* Sidebar panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-96 transform transition-all duration-300 ease-out">
          <div className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h2>
                {isLoading && (
                  <div className="ml-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-700/50">
                  {unreadCount} unread
                </span>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <FiX size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'all' 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'unread' 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                }`}
              >
                Unread
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between px-6 py-3 bg-gray-50/70 dark:bg-gray-800/30 border-b border-gray-200/30 dark:border-gray-700/30">
              <button 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`text-sm font-medium transition-colors duration-200 hover:underline ${
                  unreadCount === 0 
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                }`}
              >
                Mark all as read
              </button>
              <button 
                onClick={clearAll}
                disabled={notifications.length === 0}
                className={`text-sm font-medium transition-colors duration-200 hover:underline ${
                  notifications.length === 0 
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                }`}
              >
                Clear all
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="h-[calc(100vh-180px)] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-6">
                  <div className="p-4 rounded-full bg-gray-100/50 dark:bg-gray-800/50 mb-4">
                    <FiCheckCircle size={48} className="opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-center">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                  <p className="text-sm mt-1 opacity-75 text-center">
                    {activeTab === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100/50 dark:divide-gray-700/30">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification._id} 
                      className={`px-6 py-4 cursor-pointer transition-all duration-200 hover:shadow-sm group ${
                        notification.isRead 
                          ? 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/30' 
                          : 'bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border-l-2 border-blue-500 dark:border-blue-400'
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3 mt-1 p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className={`font-medium transition-colors duration-200 ${
                              notification.isRead 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {getNotificationTitle(notification.type)}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                              <FiClock size={12} className="mr-1" />
                              {formatTime(notification.createdAt)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.relatedEntity && (
                            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                              View {notification.relatedEntity.type}
                            </div>
                          )}
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 ml-2 mt-2">
                            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent border-t border-gray-200/30 dark:border-gray-700/30">
              <button 
                onClick={onClose}
                className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;