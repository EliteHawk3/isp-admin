import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineArchive,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

type SidebarProps = {
  onLogout: () => void; // Function to handle logout
  tempProfilePic: string | null; // Temporary profile picture
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout, tempProfilePic }) => {
  const [showConfirm, setShowConfirm] = useState(false); // Track confirm dialog state
  const { adminDetails } = useAdmin(); // Fetch admin details from context

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <HiOutlineHome size={20} /> },
    { name: "Users", path: "/users", icon: <HiOutlineUsers size={20} /> },
    {
      name: "Packages",
      path: "/packages",
      icon: <HiOutlineArchive size={20} />,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: <HiOutlineCreditCard size={20} />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <HiOutlineBell size={20} />,
    },
    { name: "Settings", path: "/settings", icon: <HiOutlineCog size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 flex flex-col border-r border-gray-700 shadow-2xl">
      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <img
          src={
            tempProfilePic || adminDetails.profilePic || "/default-avatar.jpg"
          } // Show tempProfilePic if available
          alt="Admin Avatar"
          className="w-20 h-20 rounded-full mb-3 border-4 border-gray-600 shadow-md object-cover"
        />
        <h2 className="text-white font-bold text-xl">
          {adminDetails.name || "N/A"}
        </h2>
        <p className="text-green-400 text-sm mt-1">Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-4 rounded-lg mx-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-teal-900 text-white shadow-lg shadow-gray-600/50 scale-105"
                      : "hover:bg-gray-800 hover:shadow-md hover:shadow-gray-700"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 text-sm text-center border-t border-gray-700">
        <button
          onClick={() => setShowConfirm(true)} // Show confirmation dialog
          className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-2 rounded-md transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)} // Close the dialog
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLogout(); // Call logout function
                  setShowConfirm(false); // Close the dialog
                }}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-2 px-4 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 text-sm text-center border-t border-gray-700 text-gray-400">
        <p>© 2024 ISP Admin</p>
        <p className="text-xs mt-1 text-gray-500">All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
