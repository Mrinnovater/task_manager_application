import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../layouts/Sidebar";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  TrendingUp,
  CheckCircle,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allTasks = res.data;

      setTasks(allTasks);

      const completed = allTasks.filter(
        (task) => task.status === "Completed"
      ).length;

      const pending = allTasks.filter(
        (task) => task.status === "Pending"
      ).length;

      const inProgress = allTasks.filter(
        (task) => task.status === "In Progress"
      ).length;

      const overdue = allTasks.filter(
        (task) =>
          new Date(task.deadline) <
            new Date() &&
          task.status !== "Completed"
      ).length;

      setStats({
        completed,
        pending,
        inProgress,
        overdue,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const pieData = [
    {
      name: "Completed",
      value: stats.completed,
    },
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "In Progress",
      value: stats.inProgress,
    },
    {
      name: "Overdue",
      value: stats.overdue,
    },
  ];

  const barData = [
    {
      name: "Tasks",
      Completed: stats.completed,
      Pending: stats.pending,
      InProgress: stats.inProgress,
      Overdue: stats.overdue,
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <div className="hidden md:block fixed h-screen">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {sidebarOpen && (
        <div className="fixed z-50 md:hidden">
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 md:ml-64 p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Visual insights of project productivity
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">
                  Completed
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.completed}
                </h2>
              </div>

              <div className="bg-green-100 text-green-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <CheckCircle />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">
                  Pending
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.pending}
                </h2>
              </div>

              <div className="bg-yellow-100 text-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <Clock3 />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">
                  In Progress
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.inProgress}
                </h2>
              </div>

              <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <TrendingUp />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">
                  Overdue
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.overdue}
                </h2>
              </div>

              <div className="bg-red-100 text-red-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <AlertTriangle />
              </div>
            </div>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {/* PIE CHART */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-bold mb-6">
              Task Distribution
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={120}
                    label
                  >
                    {pieData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-bold mb-6">
              Productivity Overview
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="Completed"
                    fill="#10B981"
                  />

                  <Bar
                    dataKey="Pending"
                    fill="#F59E0B"
                  />

                  <Bar
                    dataKey="InProgress"
                    fill="#3B82F6"
                  />

                  <Bar
                    dataKey="Overdue"
                    fill="#EF4444"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;