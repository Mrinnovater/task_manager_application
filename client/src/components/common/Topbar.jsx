import { Menu } from "lucide-react";

import NotificationBell from "../notifications/NotificationBell";

const Topbar = ({
  title,
  user,
  setSidebarOpen,
}) => {

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm px-4 md:px-8 py-4 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button>

        <div>

          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          <p className="text-gray-500">
            Welcome back, {user?.name}
          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATION BELL */}
        <NotificationBell />

        {/* USER AVATAR */}
        {user?.avatar ? (

          <img
            src={`${import.meta.env.VITE_API_URL.replace("/api","")}${user.avatar}`}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />

        ) : (

          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>

        )}

      </div>

    </div>
  );
};

export default Topbar;