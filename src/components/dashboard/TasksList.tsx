// src/components/dashboard/Tasks.tsx
import React from "react";
import ChartCard from "./ChartCard";
import { useTasks } from "../../context/TasksContext";
import { FiAlertCircle, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";

const TasksList: React.FC = () => {
  const { tasks, completedTasks } = useTasks();
  const allTasks = [...tasks, ...completedTasks];

  return (
    <ChartCard
      title="Tasks"
      infoTooltip="Track the progress of ongoing and completed tasks."
      height={500} // Or your preferred height
    >
      {/* Scrollable container with custom scrollbar */}
      <div className="custom-scrollbar space-y-4 overflow-y-auto pr-2 h-full">
        {" "}
        {allTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition duration-300 shadow-md"
          >
            {/* Task Header */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-300 font-medium">{task.title}</h4>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  task.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : task.status === "Completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  task.status === "Completed"
                    ? "bg-green-400"
                    : task.status === "In Progress"
                    ? "bg-blue-400"
                    : "bg-yellow-400"
                }`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>

            {/* Task Footer */}
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                {task.priority === "High Priority" && (
                  <FiAlertOctagon className="text-red-400" />
                )}
                {task.priority === "Medium Priority" && (
                  <FiAlertTriangle className="text-yellow-400" />
                )}
                {task.priority === "Low Priority" && (
                  <FiAlertCircle className="text-green-400" />
                )}
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    task.priority === "High Priority"
                      ? "bg-red-500/20 text-red-400"
                      : task.priority === "Medium Priority"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {task.priority.replace(" Priority", "")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default TasksList;
