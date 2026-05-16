import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Settings,
  LogOut,
  KanbanSquare,
  MessageSquare,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../context/ThemeContext";

const Sidebar = ({ setSidebarOpen }) => {

  const location = useLocation();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FolderKanban size={20} />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare size={20} />,
    },
    {
      name: "Kanban",
      path: "/kanban",
      icon: <KanbanSquare size={20} />,
    },
    {
      name: "Team Chat",
      path: "/chat",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell size={20} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (

    <div className="w-64 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col border-r dark:border-gray-800">

      {/* LOGO */}
      <div className="text-2xl font-bold p-6 border-b border-gray-200 dark:border-gray-800">
        TeamFlow
      </div>

      {/* THEME BUTTON */}
      <div className="px-4 pt-4">

        <button
          onClick={toggleTheme}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            p-3
            rounded-lg
            bg-gray-200
            dark:bg-gray-800
            hover:bg-gray-300
            dark:hover:bg-gray-700
            transition
          "
        >
          {darkMode ? (
            <>
              <Sun size={20} />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={20} />
              Dark Mode
            </>
          )}
        </button>

      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">

        {menu.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            onClick={() =>
              setSidebarOpen &&
              setSidebarOpen(false)
            }
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>

        ))}

      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="m-4 flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={20} />
        Logout
      </button>

    </div>
  );
};

export default Sidebar;