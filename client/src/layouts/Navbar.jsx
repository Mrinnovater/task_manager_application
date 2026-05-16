import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = ({ setSidebarOpen }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // AUTO REFRESH USER
  useEffect(() => {

    const interval = setInterval(() => {

      const updatedUser = JSON.parse(
        localStorage.getItem("user")
      );

      setUser(updatedUser);

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="h-16 bg-white shadow px-4 md:px-6 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>

        <h1 className="text-lg md:text-xl font-bold">
          Welcome Back 👋
        </h1>

      </div>

      <div className="flex items-center gap-3">

        {/* PROFILE IMAGE */}

        {user?.avatar ? (
          <img
            src={`${import.meta.env.VITE_API_URL.replace("/api","")}${user.avatar}`}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0)}
          </div>
        )}

        <div className="hidden sm:block">

          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-sm text-gray-500 capitalize">
            {user?.role}
          </p>

        </div>

      </div>

    </div>
  );
};

export default Navbar;