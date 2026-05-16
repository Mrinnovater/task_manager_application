// client/src/pages/Dashboard/DashboardPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";
import NotificationBell from "../../components/notifications/NotificationBell";
import { useTheme } from "../../context/ThemeContext";
import {
  ListTodo,
  CheckCircle,
  Loader,
  Clock3,
  FolderKanban,
  Users,
  AlertTriangle,
  TrendingUp,
  Bell,
  Menu,
   Moon,
  Sun,
} from "lucide-react";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
  darkMode,
  toggleTheme,
} = useTheme();

  // LIVE STATES
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    totalMembers: 1,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH DATA
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // CHECK AUTH
        await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // FETCH TASKS
        const taskResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tasks = await taskResponse.json();

        // FETCH PROJECTS
        const projectResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const projects = await projectResponse.json();

        // COUNTS
        const completed = tasks.filter(
          (task) => task.status === "Completed"
        ).length;

        const inProgress = tasks.filter(
          (task) => task.status === "In Progress"
        ).length;

        const pending = tasks.filter(
          (task) => task.status === "Pending"
        ).length;

        const overdue = tasks.filter((task) => {
          return (
            new Date(task.deadline) < new Date() &&
            task.status !== "Completed"
          );
        });

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          pendingTasks: pending,
          overdueTasks: overdue.length,
          totalProjects: projects.length,
          totalMembers: 1, // You can update this to fetch actual users later!
        });

        setRecentTasks(tasks.slice(0, 5));
        setOverdueTasks(overdue);

      } catch (error) {
        console.log("DASHBOARD ERROR:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: <ListTodo size={24} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: <CheckCircle size={24} />,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: <Loader size={24} />,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "Pending",
      value: stats.pendingTasks,
      icon: <Clock3 size={24} />,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: <AlertTriangle size={24} />,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: <FolderKanban size={24} />,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: "Members",
      value: stats.totalMembers,
      icon: <Users size={24} />,
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div className="hidden lg:block fixed h-screen z-50">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed z-50 lg:hidden">
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 lg:ml-64">

        {/* TOPBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">

            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 transition"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-black" />
              )}
            </button>

            {/* NOTIFICATIONS */}
            <NotificationBell />

            {/* USER AVATAR */}
            {/* USER AVATAR */}
<div
  onClick={() => window.location.href = "/settings"}
  className="cursor-pointer"
>
  {user?.avatar ? (
    <img
      src={`${import.meta.env.VITE_API_URL.replace("/api","")}${user.avatar}`}
      alt="profile"
      className="w-10 h-10 rounded-full object-cover border hover:scale-105 transition"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase hover:scale-105 transition">
      {user?.name?.charAt(0) || "U"}
    </div>
  )}
</div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 md:p-8">

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border p-6 hover:shadow-lg transition"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.text}`}
                >
                  {card.icon}
                </div>

                <h2 className="text-4xl font-bold mt-5">
                  {card.value}
                </h2>

                <p className="text-gray-500 mt-1">
                  {card.title}
                </p>
              </div>
            ))}
          </div>

          {/* PROGRESS SECTION RESTORED */}
          <div className="mt-8 bg-white rounded-2xl p-6 border">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="text-blue-600" />
              <h2 className="text-xl font-bold">
                Project Completion Status
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Frontend Development</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-3 w-[75%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Backend APIs</span>
                  <span>55%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-3 w-[55%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Database Integration</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-3 w-[90%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* TASK SECTIONS RESTORED */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            {/* OVERDUE */}
            <div className="bg-white rounded-2xl border">
              <div className="p-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-500" />
                  <h2 className="text-xl font-bold">
                    Overdue Tasks
                  </h2>
                </div>

                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                  {overdueTasks.length}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {overdueTasks.length === 0 ? (
                  <p className="text-gray-500">
                    No overdue tasks
                  </p>
                ) : (
                  overdueTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border rounded-xl p-4"
                    >
                      <h3 className="font-semibold text-lg">
                        {task.title}
                      </h3>

                      <div className="flex justify-between mt-3">
                        <span className="text-red-500 text-sm">
                          Deadline Passed
                        </span>

                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RECENT */}
            <div className="bg-white rounded-2xl border">
              <div className="p-5 border-b flex items-center gap-2">
                <TrendingUp className="text-blue-600" />

                <h2 className="text-xl font-bold">
                  Recent Activity
                </h2>
              </div>

              <div className="p-5 space-y-4">
                {recentTasks.length === 0 ? (
                  <p className="text-gray-500">
                    No recent activity
                  </p>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border rounded-xl p-4"
                    >
                      <h3 className="font-semibold text-lg">
                        {task.title}
                      </h3>

                      <div className="flex justify-between mt-3">
                        <span className="text-gray-500 text-sm">
                          {task.project?.name || "No Project"}
                        </span>

                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;