// src/types/tasks.ts
export interface Task {
  id: number; // Unique identifier for the task
  title: string; // Title of the task
  dueDate: string; // ISO date string
  status: "Pending" | "In Progress" | "Completed"; // Task's current status
  priority: "High Priority" | "Medium Priority" | "Low Priority"; // Task priority level
  progress: number; // Completion percentage (0-100)
  createdAt: string; // Task creation timestamp
  updatedAt: string; // Last update timestamp
}
