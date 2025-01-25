export interface Task {
    id: string;
    title: string; // Task title
    status: "Pending" | "In Progress" | "Completed"; // Current status
    priority: "High" | "Medium" | "Low"; // Task priority
    progress?: number; // Percentage of completion
    dueDate?: string; // Due date for the task
  }
  export interface Event {
    id: string;
    title: string; // Event title
    date: string; // Event date
    type: string; // Type of event (e.g., "Meeting", "Deadline")
  }
  export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }
  