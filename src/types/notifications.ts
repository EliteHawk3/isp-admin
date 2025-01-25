export interface Notification {
    id: string;
    title: string; // Notification title
    body: string; // Detailed message
    date: string; // Date of creation
    status: "Sent" | "Pending"; // Notification delivery status
    users: string[]; // Array of user IDs who received the notification
  }
  