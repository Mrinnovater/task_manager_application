import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../layouts/Sidebar";

import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  User,
  Flag,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
} from "lucide-react";

const TaskDetailsPage = () => {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadingFile, setUploadingFile] =
    useState(false);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, []);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTask(res.data);

    } catch (error) {
      console.log("Error fetching task:", error);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (status) => {
    try {

      setUpdating(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTask();

    } catch (error) {
      console.log("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // FETCH COMMENTS
  const fetchComments = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText("");

      fetchComments();

    } catch (error) {
      console.log(error);
    }
  };

  // FILE UPLOAD
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {

      setUploadingFile(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", selectedFile);

      await axios.post(
        `http://localhost:5000/api/tasks/${id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);

      fetchTask();

    } catch (error) {
      console.log(error);
    } finally {
      setUploadingFile(false);
    }
  };

  // DELETE FILE
  const deleteAttachment = async (fileUrl) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${id}/remove-file`,
        { fileUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTask();

    } catch (error) {
      console.log(error);
    }
  };

  if (!task) {
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

        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Tasks
        </Link>

        <div className="bg-white rounded-2xl shadow border p-6">

          {/* HEADER */}
          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-3xl font-bold">
                {task.title}
              </h1>

              <p className="text-gray-500 mt-2">
                {task.description}
              </p>
            </div>

            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              {task.status}
            </span>

          </div>

          {/* STATUS */}
          <div className="mt-6">

            <label className="block mb-2 font-semibold">
              Update Status
            </label>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(e.target.value)
              }
              disabled={updating}
              className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

          {/* ATTACHMENTS */}
          <div className="mt-8">

            <div className="flex items-center gap-2 mb-5">
              <UploadCloud size={22} />
              <h2 className="text-2xl font-bold">
                Attachments
              </h2>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl p-6">

              <div className="flex flex-col md:flex-row gap-4 items-center">

                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files[0])
                  }
                  className="bg-white border rounded-xl p-3 w-full"
                />

                <button
                  onClick={handleFileUpload}
                  disabled={uploadingFile}
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-semibold"
                >
                  {uploadingFile
                    ? "Uploading..."
                    : "Upload"}
                </button>

              </div>

            </div>

            {/* FILES */}
            <div className="grid md:grid-cols-2 gap-5 mt-6">

              {task.attachments &&
              task.attachments.length > 0 ? (

                task.attachments.map((file, index) => {

                  const isImage =
                    file.fileUrl.match(
                      /\.(jpg|jpeg|png|gif|webp)$/i
                    );

                  const isPdf =
                    file.fileUrl.match(/\.pdf$/i);

                  return (

                    <div
                      key={index}
                      className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                    >

                      {/* IMAGE PREVIEW */}
                      {isImage ? (
                        <img
                          src={`http://localhost:5000${file.fileUrl}`}
                          alt=""
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="h-48 flex items-center justify-center bg-gray-100">
                          {isPdf ? (
                            <FileText size={70} />
                          ) : (
                            <ImageIcon size={70} />
                          )}
                        </div>
                      )}

                      <div className="p-4">

                        <p className="font-semibold truncate">
                          {file.fileName}
                        </p>

                        <div className="flex gap-3 mt-4">

                          <a
                            href={`http://localhost:5000${file.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            <Download size={16} />
                            View
                          </a>

                          <button
                            onClick={() =>
                              deleteAttachment(file.fileUrl)
                            }
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })

              ) : (

                <div className="text-gray-500">
                  No attachments uploaded yet.
                </div>

              )}

            </div>

          </div>

          {/* TASK INFO */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FolderKanban size={18} />
                <h3 className="font-semibold">
                  Project
                </h3>
              </div>

              <p className="text-gray-600">
                {task.project?.name || "No Project"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} />
                <h3 className="font-semibold">
                  Assigned To
                </h3>
              </div>

              <p className="text-gray-600">
                {task.assignedTo?.name || "Unassigned"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Flag size={18} />
                <h3 className="font-semibold">
                  Priority
                </h3>
              </div>

              <p className="text-gray-600">
                {task.priority}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} />
                <h3 className="font-semibold">
                  Deadline
                </h3>
              </div>

              <p className="text-gray-600">
                {task.deadline
                  ? new Date(
                      task.deadline
                    ).toLocaleDateString()
                  : "No deadline"}
              </p>
            </div>

          </div>

          {/* COMMENTS */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Comments
            </h2>

            {/* ADD COMMENT */}
            <div className="flex gap-3 mb-6">

              <input
                type="text"
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                placeholder="Write a comment..."
                className="flex-1 border rounded-xl px-4 py-3"
              />

              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Send
              </button>

            </div>

            {/* COMMENT LIST */}
            <div className="space-y-4">

              {comments.map((comment) => (

                <div
                  key={comment._id}
                  className="bg-gray-50 border rounded-xl p-4"
                >

                  <div className="flex justify-between mb-2">

                    <h3 className="font-semibold">
                      {comment.user?.name}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {new Date(
                        comment.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                  <p className="text-gray-700">
                    {comment.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TaskDetailsPage;