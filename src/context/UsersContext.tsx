// src/context/UsersContext.tsx
import { createContext, useContext } from "react";
import { User } from "../types/users";
import { AuditLog } from "../types/auditLog";
// import { Payment } from "../types/payments";

/**
 * Defines the structure of the UsersContext.
 */
interface UsersContextType {
  users: User[]; // List of all users
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Update users
  auditLogs: AuditLog[]; // List of all audit logs
  fetchUsers: () => Promise<void>; // Fetch all users
  addUser: (newUser: User) => void; // Add a new user
  editUser: (updatedUser: User) => void; // Edit an existing user
  deleteUser: (userId: string) => void; // Delete a user
  markAsPaid: (
    userId: string,
    paymentId: string,
    paymentDate: string,
    confirmedAmount: number
  ) => void; // Mark a payment as paid
  markAsUnpaid: (userId: string, paymentId: string) => void; // Revert a payment to unpaid
  // updateUserPayments: (
  //   userId: string,
  //   updateFn: (payments: Payment[]) => Payment[]
  // ) => void; // Update payments for a user using a callback
}

/**
 * Create the UsersContext with an undefined default value.
 * Consumers must ensure they are within a UsersProvider.
 */
export const UsersContext = createContext<UsersContextType | undefined>(
  undefined
);

/**
 * Custom hook to consume the UsersContext safely.
 * Ensures the hook is only used within a valid UsersProvider.
 */
export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
