// src/context/UsersProvider.tsx
import { useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { UsersContext } from "./UsersContext";
import { User } from "../types/users";
import { AuditLog } from "../types/auditLog";
import type { Payment } from "../types/payments"; // Type-only import
import { users as initialUsers } from "../data/users"; // Mock data

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Utility function to generate passwords
  const generatePassword = (cnic: string, name: string): string => {
    const lastFourCnic = cnic.replace(/\D/g, "").slice(-4); // ✅ Extract last 4 digits of CNIC

    const cleanName = name.replace(/[^A-Za-z]/g, "").toLowerCase(); // ✅ Remove non-letters
    const firstFiveChars = cleanName.slice(0, 5); // ✅ Get first 5 characters (or less if name is short)

    const symbols = ["#", "$", "%", "&", "*"]; // ✅ Predefined set of symbols
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // ✅ Pick a random symbol

    return `${lastFourCnic}${randomSymbol}${firstFiveChars}`; // ✅ Combine elements
  };

  /**
   * Fetch users and audit logs from localStorage or initialize from mock data.
   */
  const fetchUsers = useCallback(async () => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers: User[] = JSON.parse(storedUsers);
        if (parsedUsers.length > 0) {
          setUsers(parsedUsers);
          console.log(
            "UsersProvider: Loaded users from localStorage:",
            parsedUsers
          );
        } else {
          setUsers(initialUsers);
          console.log(
            "UsersProvider: Loaded users from mock data due to empty localStorage."
          );
        }
      } else {
        setUsers(initialUsers);
        console.log(
          "UsersProvider: Loaded users from mock data:",
          initialUsers
        );
      }

      const storedAuditLogs = localStorage.getItem("auditLogs");
      if (storedAuditLogs) {
        const parsedAuditLogs: AuditLog[] = JSON.parse(storedAuditLogs);
        setAuditLogs(parsedAuditLogs);
        console.log(
          "UsersProvider: Loaded audit logs from localStorage:",
          parsedAuditLogs
        );
      } else {
        setAuditLogs([]);
        console.log("UsersProvider: Initialized empty audit logs.");
      }
    } catch (error) {
      console.error("Error fetching users or audit logs:", error);
    }
  }, []);

  /**
   * Add a new user.
   */
  const addUser = useCallback(
    (newUser: User) => {
      const password = generatePassword(newUser.cnic, newUser.name);
      const updatedUser = { ...newUser, password, active: true };
      const updatedUsers = [...users, updatedUser];
      setUsers(updatedUsers);
      console.log("UsersProvider: Added new user:", updatedUser);

      const newAuditLog: AuditLog = {
        userId: newUser.id,
        action: "Add User",
        previousStatus: "N/A",
        newStatus: "User Added",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
    },
    [users]
  );

  /**
   * Edit an existing user.
   */
  const editUser = useCallback(
    (updatedUser: User) => {
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);

      const newAuditLog: AuditLog = {
        userId: updatedUser.id,
        action: "Edit User",
        previousStatus: "N/A",
        newStatus: "User Edited",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
    },
    [users]
  );

  /**
   * Toggle user active status.
   */
  const toggleUserActiveStatus = useCallback(
    (userId: string, isActive: boolean) => {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, active: isActive } : user
      );
      setUsers(updatedUsers);

      const newAuditLog: AuditLog = {
        userId,
        action: isActive ? "Activate User" : "Deactivate User",
        previousStatus: isActive ? "Inactive" : "Active",
        newStatus: isActive ? "Active" : "Inactive",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
    },
    [users]
  );
  /**
   * Delete a user.
   */
  const deleteUser = useCallback(
    (userId: string) => {
      const userToRemove = users.find((user) => user.id === userId);
      if (!userToRemove) {
        console.warn(`User with ID ${userId} not found.`);
        return;
      }

      // Archive payments for the user before deletion
      const archivedPayments = userToRemove.payments.map((payment) => ({
        ...payment,
        archived: true,
      }));

      // Store archived payments in localStorage to prevent regeneration
      const deletedPayments = JSON.parse(
        localStorage.getItem("deletedPayments") || "[]"
      );
      const newDeletedPayments = [
        ...deletedPayments,
        ...archivedPayments.map((p) => ({
          userId,
          paymentId: p.id,
          timestamp: Date.now(),
        })),
      ];
      localStorage.setItem(
        "deletedPayments",
        JSON.stringify(newDeletedPayments)
      );

      // Remove user from state
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);

      // Add audit logs
      setAuditLogs((prevLogs) => [
        ...prevLogs,
        {
          userId,
          action: "Delete User",
          previousStatus: "Active",
          newStatus: "Deleted",
          timestamp: new Date().toISOString(),
        },
        {
          userId,
          action: "Archive Payments",
          previousStatus: "Active",
          newStatus: "Archived",
          timestamp: new Date().toISOString(),
        },
      ]);

      console.log(
        `UsersProvider: Deleted user with ID ${userId} and archived their payments.`
      );
    },
    [users, setUsers, setAuditLogs]
  );
  const deletePayment = useCallback(
    (userId: string, paymentId: string) => {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                payments: user.payments.filter(
                  (payment) => payment.id !== paymentId
                ),
              }
            : user
        );

        // Store deleted payment ID in localStorage to prevent re-creation
        const deletedPayments = JSON.parse(
          localStorage.getItem("deletedPayments") || "[]"
        );
        deletedPayments.push({ userId, paymentId, timestamp: Date.now() });
        localStorage.setItem(
          "deletedPayments",
          JSON.stringify(deletedPayments)
        );

        return updatedUsers;
      });

      // Add audit log
      setAuditLogs((prevLogs) => [
        ...prevLogs,
        {
          userId,
          action: "Delete Payment",
          previousStatus: "Existing",
          newStatus: "Deleted",
          timestamp: new Date().toISOString(),
        },
      ]);

      console.log(
        `UsersProvider: Deleted payment ${paymentId} for user ${userId}`
      );
    },
    [setUsers, setAuditLogs]
  );

  /**
   * Mark a payment as paid.
   */
  const markAsPaid = useCallback(
    (
      userId: string,
      paymentId: string,
      paymentDate: string,
      confirmedAmount: number
    ) => {
      const updatedUsers: User[] = users.map((user) => {
        if (user.id !== userId) return user; // Only modify the target user

        const updatedPayments: Payment[] = user.payments.map((payment) => {
          if (payment.id !== paymentId) return payment; // Only modify the target payment

          if (payment.status === "Paid") {
            console.warn(`Payment ${paymentId} is already marked as Paid.`);
            return payment; // Avoid re-updating already paid payments
          }

          // Update payment with new details while adhering to the Payment type
          return {
            ...payment,
            status: "Paid",
            paidDate: paymentDate, // ISO string for when the payment was made
            discountedAmount: confirmedAmount, // Final confirmed payment amount
          };
        });

        return { ...user, payments: updatedPayments };
      });

      setUsers(updatedUsers);

      // Create a new audit log entry
      const newAuditLog: AuditLog = {
        userId,
        action: "Mark as Paid",
        previousStatus: "Pending",
        newStatus: "Paid",
        amount: confirmedAmount,
        timestamp: new Date().toISOString(),
      };

      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log(
        `UsersProvider: Payment ${paymentId} marked as Paid for user ${userId}`
      );
    },
    [users]
  );

  /**
   * Mark payment as unpaid.
   */
  const markAsUnpaid = useCallback(
    (userId: string, paymentId: string) => {
      const updatedUsers: User[] = users.map((user: User) =>
        user.id === userId && user.payments
          ? {
              ...user,
              payments: user.payments.map((payment: Payment) => {
                if (payment.id !== paymentId) return payment; // No change

                const now = new Date();
                const dueDate = new Date(payment.dueDate); // Keep original due date

                return {
                  ...payment,
                  status: now > dueDate ? "Overdue" : "Pending", // ✅ Set Overdue if past due date
                  paidDate: undefined, // Remove paid date
                  dueDate: payment.dueDate, // Keep the same due date
                };
              }),
            }
          : user
      );
      setUsers(updatedUsers);
      console.log(
        `UsersProvider: Reverted payment ${paymentId} to ${
          updatedUsers
            .find((u) => u.id === userId)
            ?.payments.find((p) => p.id === paymentId)?.status
        } for user ${userId}`
      );

      // Update audit logs
      const newAuditLog: AuditLog = {
        userId,
        action: "Revert Payment",
        previousStatus: "Paid",
        newStatus:
          updatedUsers
            .find((u) => u.id === userId)
            ?.payments.find((p) => p.id === paymentId)?.status || "Pending",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log(
        "UsersProvider: Added audit log for payment reverted:",
        newAuditLog
      );
    },
    [users]
  );

  /**
   * Initialize users and auditLogs on mount.
   */
  useEffect(() => {
    fetchUsers(); // Fetch initial users and audit logs
  }, [fetchUsers]);

  /**
   * Persist users and auditLogs to localStorage whenever they change.
   */
  useEffect(() => {
    try {
      localStorage.setItem("users", JSON.stringify(users));
      console.log("UsersProvider: Persisted users to localStorage:", users);
    } catch (error) {
      console.error("Error persisting users to localStorage:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem("auditLogs", JSON.stringify(auditLogs));
      console.log(
        "UsersProvider: Persisted audit logs to localStorage:",
        auditLogs
      );
    } catch (error) {
      console.error("Error persisting audit logs to localStorage:", error);
    }
  }, [auditLogs]);

  /**
   * Memoize context value to prevent unnecessary re-renders.
   */
  const contextValue = useMemo(
    () => ({
      users,
      setUsers,
      fetchUsers,
      addUser,
      editUser,
      deleteUser,
      toggleUserActiveStatus,
      markAsPaid,
      deletePayment,
      markAsUnpaid,
      auditLogs,
    }),
    [
      users,
      fetchUsers,
      addUser,
      editUser,
      deleteUser,
      deletePayment,
      markAsPaid,
      markAsUnpaid,
      auditLogs,
      toggleUserActiveStatus,
    ]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
