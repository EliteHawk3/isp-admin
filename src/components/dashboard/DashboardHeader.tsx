import { useState } from "react";
import {
  FiDownload,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiCheckSquare,
  FiFilter,
} from "react-icons/fi";
import { useUsers } from "../../context/UsersContext";
import { usePackages } from "../../context/PackagesContext";
import { useTasks } from "../../context/TasksContext";

const DashboardHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    users: "All Users",
    payments: "All Payments",
    packages: "All Packages",
    tasks: "All Tasks",
  });

  // Context hooks
  const { users } = useUsers();
  const { packages } = usePackages();
  const { tasks, completedTasks } = useTasks();

  // Filtering functions
  const getFilteredUsers = () => {
    switch (filters.users) {
      case "Active Users":
        return users.filter(
          (user) =>
            user.packageId && user.payments?.some((p) => p.status === "Paid")
        );
      case "Inactive Users":
        return users.filter(
          (user) =>
            !user.packageId || !user.payments?.some((p) => p.status === "Paid")
        );
      default:
        return users;
    }
  };

  const getFilteredPayments = () => {
    const allPayments = users.flatMap(
      (user) => user.payments?.map((p) => ({ ...p, userName: user.name })) || []
    );

    switch (filters.payments) {
      case "Completed Payments":
        return allPayments.filter((p) => p.status === "Paid");
      case "Pending Payments":
        return allPayments.filter((p) => p.status === "Pending");
      default:
        return allPayments;
    }
  };

  const getFilteredPackages = () => {
    switch (filters.packages) {
      case "Active Packages":
        return packages.filter((pkg) => pkg.users > 0);
      case "Expired Packages":
        return packages.filter((pkg) => pkg.users === 0);
      default:
        return packages;
    }
  };

  const getFilteredTasks = () => {
    const allTasks = [...tasks, ...completedTasks];
    switch (filters.tasks) {
      case "Completed Tasks":
        return completedTasks;
      case "Pending Tasks":
        return tasks;
      default:
        return allTasks;
    }
  };

  // CSV conversion and download utilities
  const convertToCSV = (data: Record<string, unknown>[]) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((val) => {
          if (val instanceof Date) return val.toLocaleDateString();
          if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
          return val;
        })
        .join(",")
    );
    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export handlers
  const handleExportUsers = () => {
    const data = getFilteredUsers().map((user) => ({
      Name: user.name,
      Phone: user.phone,
      CNIC: user.cnic,
      Address: user.address,
      Package: packages.find((p) => p.id === user.packageId)?.name || "None",
      Status: user.packageId ? "Active" : "Inactive",
      "Installation Cost": user.installationCost,
      Discount: user.discount,
      "Discount Type": user.discountType,
      "Created At": new Date(user.createdAt).toLocaleDateString(),
      "Due Date": new Date(user.dueDate).toLocaleDateString(),
    }));
    downloadCSV(convertToCSV(data), "users_report.csv");
  };

  const handleExportPayments = () => {
    const data = getFilteredPayments().map((payment) => ({
      "User Name": payment.userName,
      Amount: payment.discountedAmount,
      Status: payment.status,
      Date: new Date(payment.paidDate || payment.dueDate).toLocaleDateString(),
    }));
    downloadCSV(convertToCSV(data), "payments_report.csv");
  };

  const handleExportPackages = () => {
    const data = getFilteredPackages().map((pkg) => ({
      Name: pkg.name,
      Cost: pkg.cost,
      Users: pkg.users,
    }));
    downloadCSV(convertToCSV(data), "packages_report.csv");
  };

  const handleExportTasks = () => {
    const data = getFilteredTasks().map((task) => ({
      Title: task.title,
      Status: task.status,
      Due: new Date(task.dueDate).toLocaleDateString(),
    }));
    downloadCSV(convertToCSV(data), "tasks_report.csv");
  };

  return (
    <div className="flex justify-between items-center p-4 text-gray-300">
      <h1 className="text-3xl font-extrabold tracking-wide">Dashboard</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <FiDownload className="mr-2" />
        Download Reports
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-2xl w-11/12 max-w-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">
                Download Reports
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users Section */}
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-3">
                  <FiUsers className="text-purple-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-200">Users</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-400" />
                  <div className="flex space-x-1">
                    {["All", "Active", "Inactive"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters({ ...filters, users: `${option} Users` })
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.users === `${option} Users`
                            ? "bg-purple-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleExportUsers}
                  className="mt-3 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Download
                </button>
              </div>

              {/* Payments Section */}
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-3">
                  <FiDollarSign className="text-green-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-200">
                    Payments
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-400" />
                  <div className="flex space-x-1">
                    {["All", "Completed", "Pending"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            payments: `${option} Payments`,
                          })
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.payments === `${option} Payments`
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleExportPayments}
                  className="mt-3 w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Download
                </button>
              </div>

              {/* Packages Section */}
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-3">
                  <FiPackage className="text-blue-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-200">
                    Packages
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-400" />
                  <div className="flex space-x-1">
                    {["All", "Active", "Expired"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            packages: `${option} Packages`,
                          })
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.packages === `${option} Packages`
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleExportPackages}
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Download
                </button>
              </div>

              {/* Tasks Section */}
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-3">
                  <FiCheckSquare className="text-yellow-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-200">Tasks</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-400" />
                  <div className="flex space-x-1">
                    {["All", "Completed", "Pending"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters({ ...filters, tasks: `${option} Tasks` })
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.tasks === `${option} Tasks`
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleExportTasks}
                  className="mt-3 w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
