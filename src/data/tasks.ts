import { Task } from "../types/tasks";

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Review Analytics Dashboard",
    dueDate: "2024-01-25",
    status: "In Progress",
    priority: "High Priority",
    progress: 60,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-10T10:30:00Z",
  },
  {
    id: 2,
    title: "Update Subscription Prices",
    dueDate: "2024-02-01",
    status: "Pending",
    priority: "Medium Priority",
    progress: 0,
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: 3,
    title: "Prepare Annual Report",
    dueDate: "2024-03-01",
    status: "Pending",
    priority: "Low Priority",
    progress: 0,
    createdAt: "2024-01-20T15:00:00Z",
    updatedAt: "2024-01-20T15:00:00Z",
  },
];
