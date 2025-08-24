import React from "react";
import { useAuth } from "../hooks/authHooks";

function Navbar() {
  const { logout } = useAuth();
    
  return (
    <nav className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-3 shadow-md">
      {/* Left - Logo/Title */}
      <h1 className="text-lg font-bold text-green-400 tracking-wide">
        💣 MINESWEEPAH
      </h1>

      {/* Right - Buttons */}
      <div className="flex gap-3">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
