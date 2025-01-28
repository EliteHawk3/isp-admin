// src/components/TaskCreationModal.tsx
import React, { useState } from "react";
import { Task } from "../../types/tasks";
import { useTasks } from "../../context/TasksContext";
import { HiOutlinePlusCircle, HiX } from "react-icons/hi";
import { FiAlertCircle, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void; // New callback prop
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
}) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium Priority");

  const handleSubmit = () => {
    if (!title.trim()) return;
    addTask({
      title,
      dueDate: new Date().toISOString(),
      status: "Pending",
      priority,
      progress: 0,
    });
    setTitle("");
    onTaskAdded(); // Notify parent about successful addition

    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <HiX size={24} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <HiOutlinePlusCircle className="text-purple-400" />
          Create New Task
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Priority Selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPriority("High Priority")}
              className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
              ${
                priority === "High Priority"
                  ? "bg-red-500/20 border-2 border-red-500"
                  : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
              }`}
            >
              <FiAlertOctagon className="w-6 h-6 text-red-400" />
              <span className="text-sm text-gray-200">High</span>
            </button>

            <button
              onClick={() => setPriority("Medium Priority")}
              className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
              ${
                priority === "Medium Priority"
                  ? "bg-yellow-500/20 border-2 border-yellow-500"
                  : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
              }`}
            >
              <FiAlertTriangle className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-200">Medium</span>
            </button>

            <button
              onClick={() => setPriority("Low Priority")}
              className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
              ${
                priority === "Low Priority"
                  ? "bg-green-500/20 border-2 border-green-500"
                  : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
              }`}
            >
              <FiAlertCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-200">Low</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <HiOutlinePlusCircle size={20} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};
export default TaskCreationModal;
