// src/components/settings/Tasks.tsx
import React, { useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
  progress: number;
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Monthly Cost Analysis",
      dueDate: "2024-01-15",
      status: "Pending",
      priority: "High Priority",
      progress: 80,
    },
    {
      id: 2,
      title: "Review Profit Reports",
      dueDate: "2024-01-20",
      status: "In Progress",
      priority: "Medium Priority",
      progress: 50,
    },
    {
      id: 3,
      title: "User Payment Updates",
      dueDate: "2024-02-01",
      status: "Pending",
      priority: "Low Priority",
      progress: 30,
    },
  ]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Task>({
    id: 0,
    title: "",
    dueDate: "",
    status: "",
    priority: "",
    progress: 0,
  });

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const completeTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "Completed", progress: 100 }
          : task
      )
    );
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const saveTask = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === editingTaskId ? editedTask : task))
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
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Tasks</h2>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm"
          >
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
                <div className="flex gap-2">
                  <button
                    onClick={saveTask}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditingTask}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-white">{task.title}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => startEditingTask(task)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => completeTask(task.id)}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
