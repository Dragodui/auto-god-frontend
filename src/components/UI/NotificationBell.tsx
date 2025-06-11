import React, { useEffect, useState } from 'react';
import { Bell, Trash2, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  Notification,
} from '@/store/slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { io } from 'socket.io-client';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_SERVER_HOST as string, {
        withCredentials: true,
      });

      newSocket.emit('join-notifications', user._id);

      newSocket.on('notification', (notification: Notification) => {
        dispatch({ type: 'notifications/addNotification', payload: notification });
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit('leave-notifications', user._id);
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleMarkAsRead = async (notificationId: string) => {
    await dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (notificationId: string) => {
    await dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'reply':
        return '↩️';
      case 'mention':
        return '📢';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-link transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-[#2c2e4c] rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-link hover:text-white transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-700 hover:bg-[#32323E] transition-colors ${
                      !notification.read ? 'bg-[#32323E]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1">
                        <Link
                          to={notification.link}
                          onClick={() => {
                            handleMarkAsRead(notification._id);
                            setIsOpen(false);
                          }}
                          className="block"
                        >
                          <p className="text-white">{notification.content}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </Link>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell; 