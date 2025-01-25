import React, { useState } from "react";
import profilePic from "../assets/10.jpg"; // Admin profile picture

// Define the Task type
type Task = {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
  progress: number;
};

const AdminProfilePage = () => {
  // Admin Details State
  const [adminDetails, setAdminDetails] = useState({
    id: "A001",
    name: "Faisal",
    phone: "+123 456 7890",
    profilePic: profilePic,
    password: "admin123", // Default password
  });
  

  const [isEditing, setIsEditing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const correctAnswer = "admin123";

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Monthly Cost Analysis", dueDate: "2024-01-15", status: "Pending", priority: "High Priority", progress: 80 },
    { id: 2, title: "Review Profit Reports", dueDate: "2024-01-20", status: "In Progress", priority: "Medium Priority", progress: 50 },
    { id: 3, title: "User Payment Updates", dueDate: "2024-02-01", status: "Pending", priority: "Low Priority", progress: 30 },
  ]);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Task>({
    id: 0,
    title: "",
    dueDate: "",
    status: "",
    priority: "",
    progress: 0,
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Statistics Data
  const statistics = {
    totalUsers: 1250,
    paidUsers: 900,
    unpaidUsers: 250,
    pendingUsers: 100,
    packages: [
      { name: "Basic Package", price: "$20", bandwidth: "20GB" },
      { name: "Premium Package", price: "$50", bandwidth: "100GB" },
      { name: "Business Package", price: "$100", bandwidth: "500GB" },
    ],
    mainPackage: { name: "Enterprise Plan", price: "$1000", bandwidth: "5TB" },
  };

  // Recent Activities
  const recentActivities = [
    { id: 1, title: "Payment Received", description: "$250 from John Doe", timestamp: "2 hours ago", iconColor: "bg-green-500" },
    { id: 2, title: "Package Updated", description: "Upgraded to Gold Plan", timestamp: "1 day ago", iconColor: "bg-blue-500" },
    { id: 3, title: "Invoice Sent", description: "Invoice #12345 sent", timestamp: "3 days ago", iconColor: "bg-yellow-500" },
  ];

  // Admin Details Handlers
  const handleVerify = () => {
    if (securityAnswer === correctAnswer) {
      setIsVerified(true);
    } else {
      alert("Incorrect security answer!");
    }
  };

  const handleSaveAdminDetails = () => {
    setIsEditing(false);
    setIsVerified(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsVerified(false);
  };

  // Task Management Handlers
  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setConfirmDeleteId(null);
  };

  const completeTask = (taskId: number) => {
    const completedTask = tasks.find((task) => task.id === taskId);
    if (completedTask) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setCompletedTasks((prevCompletedTasks) => [
        ...prevCompletedTasks,
        { ...completedTask, status: "Completed", progress: 100 },
      ]);
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const saveTask = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTaskId ? editedTask : task
      )
    );
    setEditingTaskId(null);
    setEditedTask({
      id: 0,
      title: "",
      dueDate: "",
      status: "",
      priority: "",
      progress: 0,
    });
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditedTask({
      id: 0,
      title: "",
      dueDate: "",
      status: "",
      priority: "",
      progress: 0,
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     {/* Admin Details Section */}
{/* Admin Details Section */}
<div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-md">
  {/* Admin Details Heading */}
  <h2 className="text-xl font-semibold mb-4 text-white">Admin Details</h2>

  {/* Admin Details Content */}
  <div className="flex flex-col items-center gap-4">
    <img
      src={adminDetails.profilePic}
      alt="Admin"
      className="w-32 h-32 rounded-full mb-4 object-cover"
    />
    <p className="text-white">
      <strong>ID:</strong> {adminDetails.id}
    </p>
    <p className="text-white">
      <strong>Name:</strong> {adminDetails.name}
    </p>
    <p className="text-white">
      <strong>Phone:</strong> {adminDetails.phone}
    </p>

    {/* Edit Button */}
    {!isEditing && (
      <button
        onClick={() => setIsEditing(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-md mt-6"
      >
        Edit
      </button>
    )}
  </div>

  {/* Security Question and Editing Form */}
  {isEditing && (
    <>
      {!isVerified ? (
        <div className="mt-4 flex justify-center items-center flex-col">
          <label className="block text-white mb-2 text-center">
            Security Question: <em>What is your admin password?</em>
          </label>
          <input
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="w-full bg-gray-900 text-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleVerify}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-2 rounded-md mt-4"
          >
            Verify
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex flex-col items-center gap-4">
            <label className="text-white w-full">
              Name:
              <input
                type="text"
                value={adminDetails.name}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, name: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              />
            </label>
            <label className="text-white w-full">
              Phone:
              <input
                type="text"
                value={adminDetails.phone}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, phone: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              />
            </label>
            <label className="text-white w-full">
              Password:
              <input
                type="password"
                value={adminDetails.password}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, password: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              />
            </label>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={handleSaveAdminDetails}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )}
</div>



        {/* Overview Statistics Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Overview Statistics</h2>
          <div className="flex flex-col gap-4">
            <p><strong>Total Users:</strong> {statistics.totalUsers}</p>
            <p><strong>Paid Users:</strong> {statistics.paidUsers}</p>
            <p><strong>Unpaid Users:</strong> {statistics.unpaidUsers}</p>
            <p><strong>Pending Payments:</strong> {statistics.pendingUsers}</p>
            <h3 className="mt-4 text-lg font-bold text-white">Packages:</h3>
            {statistics.packages.map((pkg, index) => (
              <p key={index}>
                <strong>{pkg.name}:</strong> {pkg.bandwidth} for {pkg.price}
              </p>
            ))}
            <h3 className="mt-4 text-lg font-bold text-white">Main Package:</h3>
            <p>
              <strong>{statistics.mainPackage.name}:</strong> {statistics.mainPackage.bandwidth} for{" "}
              {statistics.mainPackage.price}
            </p>
          </div>
        </div>

    {/* Tasks Section */}
<div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-md lg:col-span-2">
  <h2 className="text-xl font-semibold mb-4 text-white">Tasks</h2>
  <div className="flex flex-col gap-4">
    {tasks.map((task) => (
      <div key={task.id} className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm">
        {editingTaskId === task.id ? (
          <div className="flex flex-col gap-4">
            <label className="text-white">
              Title:
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              />
            </label>
            <label className="text-white">
              Due Date:
              <input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              />
            </label>
            <label className="text-white">
              Status:
              <select
                value={editedTask.status}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, status: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="text-white">
              Priority:
              <select
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
              >
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
              </select>
            </label>
            <label className="text-white">
              Progress (%):
              <input
                type="number"
                value={editedTask.progress}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    progress: Number(e.target.value),
                  })
                }
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-md mt-2"
                min="0"
                max="100"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={saveTask}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={cancelEditingTask}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white">{task.title}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditingTask(task)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => completeTask(task.id)}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-md"
                >
                  Complete
                </button>
                <button
                  onClick={() => setConfirmDeleteId(task.id)}
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-400">Due: {task.dueDate}</p>
            <p className="text-sm">
              <span
                className={`${
                  task.status === "Completed"
                    ? "text-green-500"
                    : task.status === "Pending"
                    ? "text-yellow-500"
                    : "text-blue-500"
                }`}
              >
                {task.status}
              </span>{" "}
              |{" "}
              <span
                className={`${
                  task.priority === "High Priority"
                    ? "text-red-500"
                    : task.priority === "Medium Priority"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {task.priority}
              </span>
            </p>
            <div className="w-full bg-gray-600 h-2 rounded-full mt-2">
              <div
                style={{ width: `${task.progress}%` }}
                className="h-full bg-blue-500 rounded-full"
              ></div>
            </div>
          </div>
        )}
        {confirmDeleteId === task.id && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</div>


        {/* Completed Tasks Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Completed Tasks</h2>
          <div className="flex flex-col gap-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-white">{task.title}</p>
                <p className="text-gray-400">Due: {task.dueDate}</p>
                <p className="text-green-500">Completed</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activities</h2>
          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${activity.iconColor}`}
                >
                  <span className="text-white font-bold text-lg">•</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
