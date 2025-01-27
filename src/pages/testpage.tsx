import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

interface User {
  id: string;
  name: string;
  package: string;
  dueDate: string;
  paymentStatus: "Pending" | "Paid" | "Overdue";
  amount: number;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  status: "Sent" | "Pending";
  users: string[]; // Users the notification was sent to
}

const dummyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `User ${i + 1}`,
  package: `${[10, 20, 50][i % 3]} Mbps`,
  dueDate: `2024-0${(i % 12) + 1}-15`,
  paymentStatus: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue",
  amount: (i + 1) * 10,
}));

const NotificationsPage = () => {
  const [users] = useState<User[]>(dummyUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [notificationHistory, setNotificationHistory] = useState<
    Notification[]
  >([]);
  const [customNotificationModal, setCustomNotificationModal] = useState(false);
  const [customNotification, setCustomNotification] = useState({
    title: "",
    body: "",
  });

  const userCounts = {
    All: users.length,
    Pending: users.filter((u) => u.paymentStatus === "Pending").length,
    Paid: users.filter((u) => u.paymentStatus === "Paid").length,
    Overdue: users.filter((u) => u.paymentStatus === "Overdue").length,
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map((user) => user.id);
    if (selectedUsers.length === filteredUserIds.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUserIds);
    }
  };

  const validateAndSendNotification = (
    title: string,
    body: string,
    validStatuses: string[]
  ) => {
    const invalidUsers = selectedUsers.filter(
      (id) =>
        !validStatuses.includes(
          users.find((user) => user.id === id)?.paymentStatus || ""
        )
    );

    if (invalidUsers.length > 0) {
      alert(
        `The following users cannot receive the "${title}" notification because of their payment status: \n\n${invalidUsers
          .map((id) => users.find((user) => user.id === id)?.name)
          .join(", ")}`
      );
      return;
    }

    handleSendNotification(title, body);
  };

  const handleSendNotification = (title: string, body: string) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to send a notification.");
      return;
    }

    const newNotification: Notification = {
      id: String(notificationHistory.length + 1),
      title,
      body,
      date: new Date().toISOString().split("T")[0],
      status: "Sent",
      users: selectedUsers.map(
        (id) => users.find((user) => user.id === id)?.name || "Unknown"
      ),
    };

    setNotificationHistory((prev) => [newNotification, ...prev]);
    alert(`Notification "${title}" sent to ${selectedUsers.length} users!`);
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) => {
    const matchesCategory =
      selectedCategory === "All" || user.paymentStatus === selectedCategory;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.package.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-extrabold tracking-wide mb-6">
        Notifications
      </h1>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl h-[85vh] flex flex-col">
          <div className="relative mb-6">
            <div className="flex items-center p-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-md"
              >
                <AiOutlineSearch className="text-white text-lg" />
              </motion.div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Users..."
                className="ml-3 bg-transparent w-full text-white placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Categories
          </h3>
          <ul className="space-y-4 text-sm">
            {[
              {
                label: "All",
                count: userCounts.All,
                icon: FaUsers,
                color: "text-blue-500",
              },
              {
                label: "Pending",
                count: userCounts.Pending,
                icon: FaExclamationCircle,
                color: "text-yellow-500",
              },
              {
                label: "Paid",
                count: userCounts.Paid,
                icon: FaCheckCircle,
                color: "text-green-500",
              },
              {
                label: "Overdue",
                count: userCounts.Overdue,
                icon: FaClock,
                color: "text-red-500",
              },
            ].map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedCategory(item.label)}
                className={` border-b border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 p-3 rounded-lg transition shadow-sm ${
                  selectedCategory === item.label
                    ? "bg-gray-700 bg-opacity-50"
                    : ""
                }`}
              >
                <item.icon className={`${item.color} text-lg`} />
                <span>{item.label}</span>
                <span className="ml-auto text-gray-400 text-sm">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6 flex flex-col gap-6">
          {/* Notification Buttons */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-10 py-5 rounded-xl shadow-lg text-xl font-bold"
              onClick={() =>
                validateAndSendNotification(
                  "Due Date Reminder",
                  "Your payment is due soon. Please pay before the due date.",
                  ["Pending", "Overdue"]
                )
              }
            >
              Due Date Reminder
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-5 rounded-xl shadow-lg text-xl font-bold"
              onClick={() =>
                validateAndSendNotification(
                  "Unpaid Reminder",
                  "You have overdue payments. Please settle your bill as soon as possible.",
                  ["Overdue"]
                )
              }
            >
              Unpaid Reminder
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-10 py-5 rounded-xl shadow-lg text-xl font-bold"
              onClick={() =>
                validateAndSendNotification(
                  "Promotion Alert",
                  "Upgrade your plan and get 20% off!",
                  ["Pending", "Overdue", "Paid"]
                )
              }
            >
              Promotion Alert
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-10 py-5 rounded-xl shadow-lg text-xl font-bold"
              onClick={() => setCustomNotificationModal(true)}
            >
              Custom Notification
            </motion.button>
          </div>

          {/* User List */}
          <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-md">
            {/* User List Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Users</h2>
              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all ${
                  selectedUsers.length === filteredUsers.length
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {selectedUsers.length === filteredUsers.length ? (
                  <FaToggleOn className="text-2xl" />
                ) : (
                  <FaToggleOff className="text-2xl" />
                )}
                <span className="text-sm font-semibold">
                  {selectedUsers.length === filteredUsers.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>
            </div>

            {/* User Table */}
            <div className="overflow-y-auto max-h-[400px] border-t border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Package</th>
                    <th className="py-2 px-4 text-left">Due Date</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-700 cursor-pointer ${
                        selectedUsers.includes(user.id) ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleSelectUser(user.id)}
                    >
                      <td className="py-2 px-4 flex items-center gap-2">
                        {selectedUsers.includes(user.id) && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                        {user.name}
                      </td>
                      <td className="py-2 px-4">{user.package}</td>
                      <td className="py-2 px-4">{user.dueDate}</td>
                      <td className="py-2 px-4">${user.amount.toFixed(2)}</td>
                      <td
                        className={`py-2 px-4 ${
                          user.paymentStatus === "Paid"
                            ? "text-green-400"
                            : user.paymentStatus === "Pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {user.paymentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notification History */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Notification History</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {notificationHistory.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-gradient-to-r from-gray-850 via-gray-800 to-gray-900 p-4 rounded-lg shadow-md flex flex-col gap-3"
                >
                  <div>
                    <h3 className="text-lg font-bold">{notification.title}</h3>
                    <p className="text-sm text-gray-400">{notification.body}</p>
                    <p className="text-sm text-gray-500">
                      Date: {notification.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      Sent to{" "}
                      <span className="font-bold">
                        {notification.users.length}
                      </span>{" "}
                      user(s):
                    </p>
                    <ul className="pl-4 text-sm text-gray-300 list-disc">
                      {notification.users.map((user, index) => (
                        <li key={index}>{user}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Notification Modal */}
          {customNotificationModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-white w-1/3">
                <h2 className="text-xl font-bold mb-4">Custom Notification</h2>
                <input
                  type="text"
                  value={customNotification.title}
                  onChange={(e) =>
                    setCustomNotification((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="bg-gray-800 text-white p-3 rounded-lg mb-4 w-full"
                />
                <textarea
                  value={customNotification.body}
                  onChange={(e) =>
                    setCustomNotification((prev) => ({
                      ...prev,
                      body: e.target.value,
                    }))
                  }
                  placeholder="Body"
                  rows={4}
                  className="bg-gray-800 text-white p-3 rounded-lg mb-4 w-full"
                ></textarea>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCustomNotificationModal(false)}
                    className="bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      handleSendNotification(
                        customNotification.title,
                        customNotification.body
                      );
                      setCustomNotificationModal(false);
                      setCustomNotification({ title: "", body: "" });
                    }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg"
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
