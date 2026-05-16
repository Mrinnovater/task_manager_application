import { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import axios from "axios";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Check,
  Trash2
} from "lucide-react";

const NotificationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // MOCK DATA: Structured exactly how your MongoDB will eventually send it
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ACTIONS
  const markAsRead = async (id) => {
    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        notifications.map((notif) =>
          notif._id === id
            ? { ...notif, isRead: true }
            : notif
        )
      );

    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = async (id) => {
    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        notifications.filter(
          (notif) => notif._id !== id
        )
      );

    } catch (error) {
      console.log(error);
    }
  };

  // HELPER: Get Icon based on Notification Type
  const getIcon = (type) => {
    switch (type) {
      case "task":
        return <Clock className="text-blue-500" size={24} />;
      case "alert":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "success":
        return <CheckCircle2 className="text-green-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block fixed h-screen">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed z-50 md:hidden">
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 font-medium hover:text-blue-800 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">You're all caught up!</p>
                <p className="text-sm">No new notifications at the moment.</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-5 flex items-start gap-4 transition duration-200 ${notif.isRead ? "bg-white opacity-70" : "bg-blue-50/50"
                      }`}
                  >
                    {/* ICON */}
                    <div className="mt-1">
                      {getIcon(notif.type)}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-lg ${notif.isRead ? "font-medium text-gray-700" : "font-bold text-black"}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${notif.isRead ? "text-gray-500" : "text-gray-700"}`}>
                        {notif.message}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 ml-4">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          title="Mark as read"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        title="Delete"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;