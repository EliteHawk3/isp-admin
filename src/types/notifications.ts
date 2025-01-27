import { Payment } from "./payments";
import { Package } from "./packages";
import { User } from "./users";

export interface Notification {
  id: string; // Unique identifier for the notification
  title: string; // Notification title
  body: string; // Detailed message
  date: string; // Date of creation
  status: "Sent" | "Pending"; // Notification delivery status
  users: User[]; // List of User objects who received the notification
  relatedPackage?: Package; // Optional reference to the associated package
  payments?: Payment[]; // Optional list of payments tied to this notification
}
