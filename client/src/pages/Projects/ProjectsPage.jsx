import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";
import { UserPlus, User } from "lucide-react"; // Added some nice icons
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // STATES FOR USERS AND MODAL
  const [allUsers, setAllUsers] = useState([]); // Holds all users from database
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [] // Array to hold selected user IDs
  });

  // FETCH PROJECTS & USERS ON LOAD
  useEffect(() => {
    fetchProjects();
    fetchAllUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      // UPDATE THIS LINE BELOW:
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  // HANDLE MEMBER SELECTION IN MODAL
  const toggleMemberSelection = (userId) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.members.includes(userId);
      if (isAlreadySelected) {
        // Remove user if they are already selected
        return { ...prev, members: prev.members.filter(id => id !== userId) };
      } else {
        // Add user to selection
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/projects",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add the newly created project to the screen
      setProjects([...projects, res.data]);

      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({ name: "", description: "", members: [] });

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
      console.log(error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>

          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              + Create Project
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Link
              to={`/projects/${project._id}`}
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="bg-white rounded-2xl shadow p-5 border flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {project.name || project.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                  {project.status || "Active"}
                </span>

                {/* AVATAR STACK FOR ASSIGNED MEMBERS */}
                <div className="flex -space-x-2 overflow-hidden">
                  {project.members && project.members.length > 0 ? (
                    project.members.map((member, index) => (
                      <div
                        key={index}
                        title={member.name} // Shows name on hover
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-600 text-white flex items-center justify-center text-xs font-bold"
                      >
                        {/* Show first letter of name, fallback to user icon */}
                        {member.name ? member.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- CREATE PROJECT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>

            <form onSubmit={handleCreateProject} className="space-y-4">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Website Redesign"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="What is this project about?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* ASSIGN MEMBERS SECTION */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <UserPlus size={18} /> Assign Team Members
                </label>

                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {allUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No users found to assign.</p>
                  ) : (
                    allUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => toggleMemberSelection(user._id)}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${formData.members.includes(user._id) ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.members.includes(user._id)}
                          readOnly
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-medium text-gray-700">{user.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;