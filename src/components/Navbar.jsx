import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { auth } from "../firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out.");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-200 shadow-md border-t border-blue-200 p-4 flex justify-around items-center z-50">
      <Link
        to="/"
        className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <HomeIcon className="w-6 h-6" />
        <span>Home</span>
      </Link>

      <Link
        to="/profile"
        className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <UserIcon className="w-6 h-6" />
        <span>Profile</span>
      </Link>

      <Link
        to="/add"
        className="flex flex-col items-center text-white text-sm font-medium"
      >
        <div className="w-16 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-[-10px]">
          <PlusCircleIcon className="w-8 h-8 text-white" />
        </div>
      </Link>

      <Link
        to="/search"
        className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <MagnifyingGlassIcon className="w-6 h-6" />
        <span>Search</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;


