import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";

import {
  User,
  Mail,
  Shield,
  Save,
  Camera,
} from "lucide-react";

const SettingsPage = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [successMsg, setSuccessMsg] =
    useState("");

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [avatarFile, setAvatarFile] =
    useState(null);

  // FORM STATE
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: "member",
    });

  // FETCH PROFILE
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          role: res.data.role || "member",
        });

        if (res.data.avatar) {

          setAvatarPreview(
            `${import.meta.env.VITE_API_URL.replace("/api", "")}${res.data.avatar}`
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

    fetchProfile();

  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setAvatarFile(file);

      setAvatarPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // SAVE PROFILE
  const handleSaveProfile = async (e) => {

    e.preventDefault();

    try {

      setIsLoading(true);

      const token =
        localStorage.getItem("token");

      const updatedData =
        new FormData();

      updatedData.append(
        "name",
        formData.name
      );

      updatedData.append(
        "email",
        formData.email
      );

     if (avatarFile) {

  console.log(
    "Selected file:",
    avatarFile
  );

  updatedData.append(
    "avatar",
    avatarFile
  );

}

for (let pair of updatedData.entries()) {

  console.log(
    pair[0],
    pair[1]
  );

}

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      // UPDATE LOCAL STORAGE
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setSuccessMsg(
        "Profile updated successfully!"
      );

      alert("Profile updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

    } catch (error) {

      console.log(error);

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <div className="hidden md:block fixed h-screen">

        <Sidebar
          setSidebarOpen={setSidebarOpen}
        />

      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (

        <div className="fixed z-50 md:hidden">

          <Sidebar
            setSidebarOpen={setSidebarOpen}
          />

        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 md:ml-64 p-6">

        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            Account Settings
          </h1>

          <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* TOP SECTION */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 flex items-center gap-6">

              <div className="relative">

                {/* IMAGE */}
                {avatarPreview ? (

                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />

                ) : (

                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white uppercase">
                    {formData.name
                      ? formData.name.charAt(0)
                      : "U"}
                  </div>
                )}

                {/* IMAGE INPUT */}
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 cursor-pointer">

                  <Camera size={16} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                </label>

              </div>

              <div className="text-white">

                <h2 className="text-2xl font-bold">
                  {formData.name || "User"}
                </h2>

                <p className="text-gray-300 capitalize">
                  {formData.role}
                </p>

              </div>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSaveProfile}
              className="p-8 space-y-6"
            >

              {/* NAME */}
              <div>

                <label className="block font-medium mb-2 flex items-center gap-2">

                  <User size={18} />
                  Full Name

                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="block font-medium mb-2 flex items-center gap-2">

                  <Mail size={18} />
                  Email Address

                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

              </div>

              {/* ROLE */}
              <div>

                <label className="block font-medium mb-2 flex items-center gap-2">

                  <Shield size={18} />
                  Account Role

                </label>

                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                />

              </div>

              {/* SUCCESS */}
              {successMsg && (

                <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded-lg">

                  {successMsg}

                </div>
              )}

              {/* BUTTON */}
              <div className="pt-4 border-t flex justify-end">

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >

                  <Save size={18} />

                  {isLoading
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;