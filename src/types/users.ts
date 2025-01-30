// src/types/users.ts
import { Payment } from "./payments";

/**
 * Defines the structure of a User.
 */
export interface User {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  address: string;
  packageId: string; // Must match a package's id
  installationCost: number;
  discount: number; // USD
  discountType: "everytime" | "one-time";
  payments: Payment[];
  createdAt: string; // ISO date string
  lastPaidDate?: string; // ISO date string, optional
  dueDate: string; // ISO date string
  password: string; // Password is now mandatory
  active: boolean; // Indicates if the user is active or inactive
}
