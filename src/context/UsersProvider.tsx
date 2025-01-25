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

  /**
   * Fetch users and audit logs from localStorage or initialize from mock data.
   */
  const fetchUsers = useCallback(async () => {
    try {
      // Fetch users from localStorage
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

      // Fetch auditLogs from localStorage
      const storedAuditLogs = localStorage.getItem("auditLogs");
      if (storedAuditLogs) {
        const parsedAuditLogs: AuditLog[] = JSON.parse(storedAuditLogs);
        setAuditLogs(parsedAuditLogs);
        console.log(
          "UsersProvider: Loaded audit logs from localStorage:",
          parsedAuditLogs
        );
      } else {
        setAuditLogs([]); // Initialize as empty array if not present
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
      const updatedUsers: User[] = [
        ...users,
        { ...newUser, payments: newUser.payments || [] },
      ];
      setUsers(updatedUsers);
      console.log("UsersProvider: Added new user:", newUser);

      // Update audit logs
      const newAuditLog: AuditLog = {
        userId: newUser.id,
        action: "Add User",
        previousStatus: "N/A",
        newStatus: "User Added",
        timestamp: new Date().toISOString(),
        // 'amount' is optional and omitted here
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log("UsersProvider: Added audit log for new user:", newAuditLog);
    },
    [users]
  );

  /**
   * Edit an existing user.
   */
  const editUser = useCallback(
    (updatedUser: User) => {
      const updatedUsers: User[] = users.map((user: User) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      console.log("UsersProvider: Edited user:", updatedUser);

      // Update audit logs
      const newAuditLog: AuditLog = {
        userId: updatedUser.id,
        action: "Edit User",
        previousStatus: "N/A",
        newStatus: "User Edited",
        timestamp: new Date().toISOString(),
        // 'amount' is optional and omitted here
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log(
        "UsersProvider: Added audit log for edited user:",
        newAuditLog
      );
    },
    [users]
  );

  /**
   * Delete a user.
   */
  const deleteUser = useCallback(
    (userId: string) => {
      const userToDelete = users.find((user: User) => user.id === userId);
      if (userToDelete) {
        const updatedUsers: User[] = users.filter(
          (user: User) => user.id !== userId
        );
        setUsers(updatedUsers);
        console.log(`UsersProvider: Deleted user with id: ${userId}`);

        // Update audit logs
        const newAuditLog: AuditLog = {
          userId,
          action: "Delete User",
          previousStatus: "Active",
          newStatus: "User Deleted",
          timestamp: new Date().toISOString(),
          // 'amount' is optional and omitted here
        };
        setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
        console.log(
          "UsersProvider: Added audit log for deleted user:",
          newAuditLog
        );
      } else {
        console.warn(
          `UsersProvider: Attempted to delete non-existent user with id: ${userId}`
        );
      }
    },
    [users]
  );

  /**
   * Mark payment as paid.
   */
  const markAsPaid = useCallback(
    (
      userId: string,
      paymentId: string,
      paymentDate: string,
      confirmedAmount: number
    ) => {
      const updatedUsers: User[] = users.map((user: User) =>
        user.id === userId && user.payments
          ? {
              ...user,
              payments: user.payments.map((payment: Payment) =>
                payment.id === paymentId
                  ? {
                      ...payment,
                      status: "Paid", // Valid union type
                      paidDate: paymentDate,
                      discountedAmount: confirmedAmount,
                    }
                  : payment
              ),
            }
          : user
      );
      setUsers(updatedUsers);
      console.log(
        `UsersProvider: Marked payment ${paymentId} as Paid for user ${userId}`
      );

      // Update audit logs
      const newAuditLog: AuditLog = {
        userId,
        action: "Mark as Paid",
        previousStatus: "Pending",
        newStatus: "Paid",
        amount: confirmedAmount, // Ensure 'amount' is part of AuditLog
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log(
        "UsersProvider: Added audit log for payment marked as paid:",
        newAuditLog
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
              payments: user.payments.map((payment: Payment) =>
                payment.id === paymentId
                  ? { ...payment, status: "Pending", paidDate: undefined } // Valid union type
                  : payment
              ),
            }
          : user
      );
      setUsers(updatedUsers);
      console.log(
        `UsersProvider: Reverted payment ${paymentId} to Pending for user ${userId}`
      );

      // Update audit logs
      const newAuditLog: AuditLog = {
        userId,
        action: "Revert Payment",
        previousStatus: "Paid",
        newStatus: "Pending",
        timestamp: new Date().toISOString(),
        // 'amount' is optional and omitted here
      };
      setAuditLogs((prevLogs) => [...prevLogs, newAuditLog]);
      console.log(
        "UsersProvider: Added audit log for payment reverted to pending:",
        newAuditLog
      );
    },
    [users]
  );

  /**
   * Update user's payments with a callback function.
   * @param userId - ID of the user whose payments are to be updated.
   * @param updateFn - Function that receives and modifies the user's payments.
   */
  // const updateUserPayments = useCallback(
  //   (
  //     userId: string,
  //     updateFn: (payments: User["payments"]) => User["payments"]
  //   ) => {
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user.id === userId
  //           ? { ...user, payments: updateFn(user.payments) }
  //           : user
  //       )
  //     );
  //     console.log(
  //       `UsersProvider: Updated payments for user with id: ${userId}`
  //     );
  //   },
  //   []
  // );

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
      markAsPaid,
      markAsUnpaid,
      auditLogs,
      // updateUserPayments, // Expose the updateUserPayments function
    }),
    [
      users,
      fetchUsers,
      addUser,
      editUser,
      deleteUser,
      markAsPaid,
      markAsUnpaid,
      auditLogs,
      // updateUserPayments,
    ]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
