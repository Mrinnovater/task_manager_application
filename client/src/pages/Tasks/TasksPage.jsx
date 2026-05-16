import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";
import { Calendar, Flag, User, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "Medium",
    deadline: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch Tasks, Projects, and Users all at once!
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks", config),
        axios.get("http://localhost:5000/api/projects", config),
        axios.get("http://localhost:5000/api/auth/users", config),
      ]);

      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI immediately
      setTasks([...tasks, res.data]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        priority: "Medium",
        deadline: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create task");
      console.log(error);
    }
  };

  // Helper for priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* SIDEBARS */}
      <div className="hidden md:block fixed h-screen">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>
      {sidebarOpen && (
        <div className="fixed z-50 md:hidden">
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              + Create Task
            </button>
          )}
        </div>

        {/* TASKS GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks found. Create one to get started!</p>
          ) : (
            tasks.map((task) => (
              <Link
                to={`/tasks/${task._id}`}
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="bg-white rounded-2xl shadow p-5 border border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <span className={`text-xs px-2 py-1 rounded-md font-bold ${getPriorityColor(task.priority || "Medium")}`}>
                      {task.priority || "Medium"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800-t pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Folder size={16} />
                    <span>{task.project?.name || "No Project"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{task.assignedTo?.name || "Unassigned"}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <Calendar size={16} />
                      <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Date"}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {task.status || "Pending"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  rows="2"
                  className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* PROJECT DROPDOWN */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Project</label>
                  <select
                    className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* ASSIGN USER DROPDOWN */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Assign To</label>
                  <select
                    className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {/* PRIORITY DROPDOWN */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Priority</label>
                  <select
                    className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* DEADLINE DATE PICKER */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-200 dark:border-gray-800 border border-gray-200 dark:border-gray-800-gray-300 rounded-lg px-4 py-2"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;