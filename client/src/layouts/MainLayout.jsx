import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-950 text-black dark:text-white min-h-screen transition">

      {/* MOBILE SIDEBAR OVERLAY */}

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}

      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-screen
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="p-4 md:p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default MainLayout;