// src/types/payments.ts

/**
 * Defines the structure of a Payment.
 */
export interface Payment {
  id: string;
  userId: string;
  packageId: string; // Must match a package's id
  discountedAmount: number; // USD
  status: "Paid" | "Pending" | "Overdue"; // Specific statuses
  date: string; // ISO date string
  dueDate: string; // ISO date string
  paidDate?: string; // ISO date string, optional
}
