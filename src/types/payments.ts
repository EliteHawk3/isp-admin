// src/types/payments.ts

/**
 * Defines the structure of a Payment.
 */
export interface Payment {
  id: string;
  userId: string;
  packageId: string; // Must match a package's id
  packageName: string; // Historical reference to the package name
  costAtPaymentTime: number; // Package cost when payment was created
  discountedAmount: number; // USD (calculated based on cost and discountAtPaymentTime)
  discountAtPaymentTime: number; // Discount applied at the time of payment creation
  status: "Paid" | "Pending" | "Overdue"; // Specific statuses
  date: string; // ISO date string
  dueDate: string; // ISO date string
  paidDate?: string; // ISO date string, optional
  archived?: boolean; // Marks if the payment is archived
}
