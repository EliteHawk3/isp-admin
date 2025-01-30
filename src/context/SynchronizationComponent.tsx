// src/context/SynchronizationComponent.tsx
import { useEffect } from "react";
import { useUsers } from "./UsersContext";
import { usePackages } from "./PackagesContext";
import { Payment } from "../types/payments";
interface DeletedPayment {
  userId: string;
  paymentId: string;
  timestamp: number;
}

/**
 * SynchronizationComponent
 * Handles cross-context synchronization between Users and Packages.
 * - Archives payments for deleted packages.
 * - Updates pending/overdue payments for package edits.
 * - Ensures passwords are generated for users missing them.
 * - Prevents updates to paid or archived payments.
 * - Excludes inactive users from payment generation.
 */

const SynchronizationComponent: React.FC = () => {
  const { users, setUsers } = useUsers();
  const { packages, setPackages } = usePackages();

  /**
   * Generate a password for a user based on their CNIC and name.
   * @param cnic - The user's CNIC (National ID).
   * @param name - The user's name.
   * @returns A generated password in the format "<CNIC>@<FirstName>".
   */
  const generatePassword = (cnic: string, name: string): string => {
    const lastFourCnic = cnic.replace(/\D/g, "").slice(-4); // ✅ Extract last 4 digits of CNIC

    const cleanName = name.replace(/[^A-Za-z]/g, "").toLowerCase(); // ✅ Remove non-letters
    const firstFiveChars = cleanName.slice(0, 5); // ✅ Get first 5 characters (or less if name is short)

    const symbols = ["#", "$", "%", "&", "*"]; // ✅ Predefined set of symbols
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // ✅ Pick a random symbol

    return `${lastFourCnic}${randomSymbol}${firstFiveChars}`; // ✅ Combine elements
  };

  /**
   * Calculate the due date by adding one month to a given date.
   * @param startDate - The base date for due date calculation.
   * @returns The calculated due date in ISO format.
   */
  const calculateDueDate = (startDate: string): string => {
    const date = new Date(startDate);
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);

    // Adjust for months with fewer days
    if (nextMonth.getDate() !== date.getDate()) {
      nextMonth.setDate(0); // Set to the last day of the previous month
    }

    return nextMonth.toISOString();
  };
  /**
   * Retrieve deleted payments from localStorage.
   */
  const getDeletedPayments = (): DeletedPayment[] => {
    return JSON.parse(localStorage.getItem("deletedPayments") || "[]");
  };

  /**
   * Synchronize user counts in packages.
   * Updates the `users` field in each package based on linked users.
   */
  useEffect(() => {
    if (!packages.length || !users.length) return;

    const updatedPackages = packages.map((pkg) => {
      const userCount = users.filter(
        (user) => user.packageId === pkg.id
      ).length;
      return { ...pkg, users: userCount };
    });

    const hasChanges = updatedPackages.some(
      (pkg, index) => pkg.users !== packages[index].users
    );

    if (hasChanges) {
      setPackages(updatedPackages);
      console.log("Synchronized package user counts.");
    }
  }, [users, packages, setPackages]);

  /**
   * Archive payments for deleted packages and ensure proper metadata.
   */
  useEffect(() => {
    if (!packages.length || !users.length) return;

    const updatedUsers = users.map((user) => {
      const packageDetails = packages.find((pkg) => pkg.id === user.packageId);

      if (!packageDetails) {
        const archivedPayments = user.payments.map((payment) => ({
          ...payment,
          archived: true,
          packageName: payment.packageName || "Deleted Package",
        }));

        // Store archived payments to prevent regeneration
        const deletedPayments = getDeletedPayments();
        const newDeletedPayments = [
          ...deletedPayments,
          ...archivedPayments.map((p) => ({
            userId: user.id,
            paymentId: p.id,
            timestamp: Date.now(),
          })),
        ];
        localStorage.setItem(
          "deletedPayments",
          JSON.stringify(newDeletedPayments)
        );

        return { ...user, payments: archivedPayments };
      }

      const updatedPayments = user.payments.map((payment) => {
        if (payment.archived || payment.status === "Paid") {
          return payment;
        }

        if (payment.status === "Pending" || payment.status === "Overdue") {
          return {
            ...payment,
            costAtPaymentTime: packageDetails.cost,
            packageName: packageDetails.name,
            discountedAmount: Math.max(
              packageDetails.cost - (user.discount || 0),
              0
            ),
          };
        }

        return payment;
      });

      return { ...user, payments: updatedPayments };
    });

    if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
      setUsers(updatedUsers);
      console.log(
        "Archived payments for deleted packages and updated metadata."
      );
    }
  }, [users, packages, setUsers]);

  /**
   * Ensure active users have payments for the current month and passwords.
   */
  useEffect(() => {
    if (!packages.length || !users.length) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const updatedUsers = users.map((user) => {
      if (!user.active) return user;

      const packageDetails = packages.find((pkg) => pkg.id === user.packageId);
      if (!packageDetails) return user;

      let hasChanges = false;

      if (!user.password) {
        user.password = generatePassword(user.cnic, user.name);
        hasChanges = true;
        console.log(`Generated password for user: ${user.name}`);
      }

      const updatedPayments = user.payments.map((payment) => ({
        ...payment,
        costAtPaymentTime: payment.costAtPaymentTime || packageDetails.cost,
        discountAtPaymentTime:
          payment.discountAtPaymentTime ?? (user.discount || 0),
        packageName: payment.packageName || packageDetails.name,
      }));

      const hasPaymentForCurrentMonth = updatedPayments.some((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });

      // Retrieve deleted payments to prevent re-creation
      const deletedPayments = getDeletedPayments();
      const wasDeleted = deletedPayments.some(
        (p) =>
          p.userId === user.id &&
          p.paymentId.startsWith(`${user.id}-${currentMonth}-${currentYear}`)
      );

      if (!hasPaymentForCurrentMonth && !wasDeleted) {
        const discount =
          user.discountType === "everytime"
            ? user.discount
            : user.payments.some((p) => p.status === "Paid")
            ? 0
            : user.discount;

        const newPayment: Payment = {
          id: `${user.id}-${currentMonth}-${currentYear}`,
          userId: user.id,
          packageId: user.packageId,
          packageName: packageDetails.name,
          costAtPaymentTime: packageDetails.cost,
          discountedAmount: Math.max(packageDetails.cost - discount, 0),
          discountAtPaymentTime: discount,
          status: "Pending",
          date: now.toISOString(),
          dueDate: calculateDueDate(user.createdAt || now.toISOString()),
        };

        updatedPayments.push(newPayment);
        hasChanges = true;
        console.log(`Generated new payment for user: ${user.name}`);
      }

      return hasChanges ? { ...user, payments: updatedPayments } : user;
    });

    // Cleanup old deleted payments after one month
    const currentTime = Date.now();
    const newDeletedPayments = getDeletedPayments().filter(
      (p: DeletedPayment) =>
        currentTime - p.timestamp < 30 * 24 * 60 * 60 * 1000
    );
    localStorage.setItem("deletedPayments", JSON.stringify(newDeletedPayments));

    if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
      setUsers(updatedUsers);
      console.log(
        "Generated missing monthly payments and passwords for active users."
      );
    }
  }, [users, packages, setUsers]);
  return null;
};

export default SynchronizationComponent;
