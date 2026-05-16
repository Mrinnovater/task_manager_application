import { useEffect, useState } from "react";

import axios from "axios";

import { Bell } from "lucide-react";

const NotificationBell = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(
  (n) => !n.isRead
).length;

  const markAsRead = async (id) => {
    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <Bell size={24} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white border rounded-2xl shadow-2xl z-50 overflow-hidden">

          <div className="p-4 border-b font-bold text-lg">
            Notifications
          </div>

          <div className="max-h-[500px] overflow-y-auto">

            {loading ? (
              <div className="p-5 text-center">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-5 text-center text-gray-500">
                No notifications
              </div>
            ) : (

              notifications.map((notification) => (

                <div
                  key={notification._id}
                  className={`p-4 border-b hover:bg-gray-50 transition cursor-pointer ${
  !notification.isRead
    ? "bg-blue-50"
    : ""
}`}
                  onClick={() =>
                    markAsRead(notification._id)
                  }
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    )}

                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>

                </div>
              ))

            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;