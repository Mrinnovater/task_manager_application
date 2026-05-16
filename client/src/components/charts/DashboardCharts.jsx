import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const DashboardCharts = ({ stats }) => {
  const taskData = [
    {
      name: "Completed",
      value: stats.completedTasks,
    },
    {
      name: "Pending",
      value: stats.pendingTasks,
    },
    {
      name: "In Progress",
      value: stats.inProgressTasks,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#eab308",
    "#3b82f6",
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="text-xl font-bold mb-5">
          Task Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={taskData}
              dataKey="value"
              outerRadius={110}
              label
            >
              {taskData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="text-xl font-bold mb-5">
          Tasks Analytics
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={taskData}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;