import React, { useState } from "react";
import { useTasks } from "../../context/TasksContext";
import { Task } from "../../types/tasks";

const TaskComponent: React.FC = () => {
  const { tasks, addTask, editTask, deleteTask, completeTask } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("Medium Priority");

  const [editTaskId, setEditTaskId] = useState<number | null>(null); // Ensure editTaskId is a number
  const [editTaskTitle, setEditTaskTitle] = useState<string>("");
  const [editTaskPriority, setEditTaskPriority] =
    useState<Task["priority"]>("Medium Priority");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      dueDate: new Date().toISOString(),
      status: "Pending",
      priority: newTaskPriority,
      progress: 0,
    });
    setNewTaskTitle("");
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id); // Task ID is already a number
    setEditTaskTitle(task.title);
    setEditTaskPriority(task.priority);
  };

  const handleSaveEditTask = () => {
    if (editTaskId === null || !editTaskTitle.trim()) return;
    editTask(editTaskId, {
      title: editTaskTitle,
      priority: editTaskPriority,
    });
    setEditTaskId(null); // Exit edit mode
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Tasks</h2>

      {/* Add Task Form */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none"
          />
          <select
            value={newTaskPriority}
            onChange={(e) =>
              setNewTaskPriority(e.target.value as Task["priority"])
            }
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none"
          >
            <option value="High Priority">High Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="Low Priority">Low Priority</option>
          </select>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h4 className="text-white font-semibold">{task.title}</h4>
              <p className="text-sm text-gray-400">Priority: {task.priority}</p>
            </div>
            <div className="flex gap-2">
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-gray-700 text-gray-200"
                  />
                  <select
                    value={editTaskPriority}
                    onChange={(e) =>
                      setEditTaskPriority(e.target.value as Task["priority"])
                    }
                    className="px-3 py-1 rounded-lg bg-gray-700 text-gray-200"
                  >
                    <option value="High Priority">High Priority</option>
                    <option value="Medium Priority">Medium Priority</option>
                    <option value="Low Priority">Low Priority</option>
                  </select>
                  <button
                    onClick={handleSaveEditTask}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => completeTask(task.id)} // Task ID is already a number
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Complete
                  </button>
                </>
              )}
              <button
                onClick={() => deleteTask(task.id)} // Task ID is already a number
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskComponent;
