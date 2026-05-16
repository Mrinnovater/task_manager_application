import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../layouts/Sidebar";

import {
  FolderKanban,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const ProjectDetailsPage = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(res.data);
    } catch (error) {
      console.log("Error fetching project:", error);
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

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
        {/* BACK */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </Link>

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
              <FolderKanban size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {project.name}
              </h1>

              <p className="text-gray-500 mt-1">
                {project.description}
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">
                Status
              </p>

              <h3 className="font-bold mt-1">
                {project.status || "Active"}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">
                Members
              </p>

              <h3 className="font-bold mt-1">
                {project.members?.length || 0}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">
                Created
              </p>

              <h3 className="font-bold mt-1">
                {new Date(project.createdAt).toLocaleDateString()}
              </h3>
            </div>
          </div>
        </div>

        {/* MEMBERS */}
        <div className="bg-white rounded-2xl shadow border p-6 mt-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="text-blue-600" />
            <h2 className="text-2xl font-bold">
              Team Members
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {project.members?.map((member) => (
              <div
                key={member._id}
                className="border rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase">
                  {member.name?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {member.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TASKS */}
        <div className="bg-white rounded-2xl shadow border p-6 mt-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="text-green-600" />
            <h2 className="text-2xl font-bold">
              Tasks
            </h2>
          </div>

          {project.tasks?.length === 0 ? (
            <p className="text-gray-500">
              No tasks available.
            </p>
          ) : (
            <div className="space-y-4">
              {project.tasks?.map((task) => (
                <div
                  key={task._id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {task.status}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-red-500">
                    <Calendar size={16} />

                    <span className="text-sm">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "No deadline"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;