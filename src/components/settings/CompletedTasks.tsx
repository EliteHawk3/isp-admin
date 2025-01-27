import React from "react";
import { useTasks } from "../../context/TasksContext";

const CompletedTasksComponent: React.FC = () => {
  const { completedTasks, deleteTask } = useTasks();

  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Completed Tasks</h2>

      {completedTasks.length > 0 ? (
        <ul className="space-y-4">
          {completedTasks.map((task) => (
            <li
              key={task.id} // Task ID is already a number
              className="p-4 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h4 className="text-white font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-400">
                  Priority: {task.priority}
                </p>
              </div>
              <button
                onClick={() => deleteTask(task.id)} // Task ID is already a number
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No completed tasks yet.</p>
      )}
    </div>
  );
};

export default CompletedTasksComponent;
