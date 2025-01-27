// src/components/settings/CompletedTasks.tsx
import React from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  status: string;
};

const CompletedTasks = () => {
  const completedTasks: Task[] = [
    {
      id: 1,
      title: "Monthly Cost Analysis",
      dueDate: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      title: "Review Profit Reports",
      dueDate: "2024-01-20",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Completed Tasks</h2>
      <div className="flex flex-col gap-4">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm"
          >
            <p className="font-semibold text-white">{task.title}</p>
            <p className="text-gray-400">Due: {task.dueDate}</p>
            <p className="text-green-500">Completed</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks;
