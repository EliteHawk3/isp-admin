import { useState, ReactNode, useCallback } from "react";
import { Task } from "../types/tasks";
import { TasksContext } from "./TasksContext";
import { mockTasks } from "../data/tasks"; // Import mock tasks

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks); // Initialize with mock data
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  // Rest of the provider code remains the same
  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...task,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
    },
    []
  );

  const editTask = useCallback(
    (id: number, updates: Partial<Omit<Task, "id">>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
    },
    []
  );

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setCompletedTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const completeTask = useCallback((id: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) {
        setCompletedTasks((completed) => [
          ...completed,
          {
            ...task,
            status: "Completed",
            progress: 100,
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const resetTasks = useCallback(() => {
    setTasks([]);
    setCompletedTasks([]);
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        completedTasks,
        addTask,
        editTask,
        deleteTask,
        completeTask,
        resetTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
