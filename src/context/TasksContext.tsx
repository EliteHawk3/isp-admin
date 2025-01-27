// src/context/TasksContext.tsx
import { createContext, useContext } from "react";
import { Task } from "../types/tasks";

// Define the shape of the TasksContext
export interface TasksContextType {
  tasks: Task[];
  completedTasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  editTask: (id: number, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: number) => void;
  completeTask: (id: number) => void;
  resetTasks: () => void;
}

// Create the TasksContext
export const TasksContext = createContext<TasksContextType | undefined>(
  undefined
);

// Custom hook to use the TasksContext
export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
