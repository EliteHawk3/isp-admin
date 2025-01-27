import React from "react";
import { useUsers } from "../../context/UsersContext";
import { usePackages } from "../../context/PackagesContext";
import { useNotifications } from "../../context/NotificationsContext";
import { HiOutlineUser, HiOutlineArchive, HiOutlineBell } from "react-icons/hi";

const OverviewStatistics: React.FC = () => {
  const { users } = useUsers();
  const { packages } = usePackages();
  const { notifications } = useNotifications();

  // Calculate user statistics
  const totalUsers = users.length;
  const paidUsers = users.filter((user) =>
    user.payments?.some((payment) => payment.status === "Paid")
  ).length;
  const unpaidUsers = totalUsers - paidUsers;

  // Get total notifications
  const totalNotifications = notifications.length;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Overview Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Statistics */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md text-white group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <HiOutlineUser className="text-green-400" size={24} />
              Users
            </h3>
          </div>
          <div className="mt-4 text-sm">
            <p>
              <strong>Total Users:</strong> {totalUsers}
            </p>
            <p>
              <strong>Paid Users:</strong> {paidUsers}
            </p>
            <p>
              <strong>Unpaid Users:</strong> {unpaidUsers}
            </p>
          </div>
        </div>

        {/* Packages Statistics */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md text-white group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <HiOutlineArchive className="text-blue-400" size={24} />
              Packages
            </h3>
          </div>
          <div className="mt-4 text-sm">
            <p>
              <strong>Total Packages:</strong> {packages.length}
            </p>
            {packages.map((pkg) => (
              <p key={pkg.id}>
                <strong>{pkg.name}:</strong> ${pkg.cost}
              </p>
            ))}
          </div>
        </div>

        {/* Notifications Statistics */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md text-white group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <HiOutlineBell className="text-yellow-400" size={24} />
              Notifications
            </h3>
          </div>
          <div className="mt-4 text-sm">
            <p>
              <strong>Total Notifications:</strong> {totalNotifications}
            </p>
            <p>
              <strong>Sent:</strong>{" "}
              {notifications.filter((notif) => notif.status === "Sent").length}
            </p>
            <p>
              <strong>Pending:</strong>{" "}
              {
                notifications.filter((notif) => notif.status === "Pending")
                  .length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStatistics;
