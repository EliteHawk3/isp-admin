// src/context/SynchronizationComponent.tsx
import { useEffect } from "react";
import { useUsers } from "./UsersContext";
import { usePackages } from "./PackagesContext";
import { Payment } from "../types/payments";

const SynchronizationComponent: React.FC = () => {
  const { users, setUsers } = useUsers();
  const { packages, setPackages } = usePackages();
  //updateUserPayments
  /**
   * Update user counts in packages based on current users.
   */
  useEffect(() => {
    if (!packages.length || !users.length) {
      console.log(
        "SynchronizationComponent: Skipping package synchronization."
      );
      return;
    }

    console.log("SynchronizationComponent: Checking package user counts...");
    const updatedPackages = packages.map((pkg) => {
      const userCount = users.filter(
        (user) => user.packageId === pkg.id
      ).length;
      return pkg.users !== userCount ? { ...pkg, users: userCount } : pkg;
    });

    const hasChanges = updatedPackages.some(
      (pkg, index) => pkg.users !== packages[index].users
    );

    if (hasChanges) {
      setPackages(updatedPackages);
      console.log("SynchronizationComponent: Package user counts updated.");
    } else {
      console.log(
        "SynchronizationComponent: No changes in package user counts."
      );
    }
  }, [users, packages, setPackages]);

  /**
   * Ensure payments are updated when user packages or package prices change.
   */
  // useEffect(() => {
  //   if (!packages.length || !users.length) {
  //     console.log(
  //       "SynchronizationComponent: Skipping payment synchronization."
  //     );
  //     return;
  //   }

  //   console.log("SynchronizationComponent: Synchronizing payments...");
  //   let globalPaymentsUpdated = false;

  //   users.forEach((user) => {
  //     const userPackage = packages.find((pkg) => pkg.id === user.packageId);
  //     if (!userPackage) {
  //       console.warn(
  //         `SynchronizationComponent: Invalid packageId for user ${user.id}`
  //       );
  //       return;
  //     }

  //     let userPaymentsUpdated = false;

  //     updateUserPayments(user.id, (payments) => {
  //       const updatedPayments = payments.map((payment) => {
  //         if (
  //           payment.status === "Pending" &&
  //           payment.packageId === user.packageId &&
  //           payment.discountedAmount !==
  //             Math.max(userPackage.cost - (user.discount || 0), 0)
  //         ) {
  //           userPaymentsUpdated = true;
  //           return {
  //             ...payment,
  //             discountedAmount: Math.max(
  //               userPackage.cost - (user.discount || 0),
  //               0
  //             ),
  //           };
  //         }
  //         return payment;
  //       });

  //       if (userPaymentsUpdated) globalPaymentsUpdated = true;
  //       return updatedPayments;
  //     });
  //   });

  //   if (globalPaymentsUpdated) {
  //     console.log(
  //       "SynchronizationComponent: Payment synchronization complete."
  //     );
  //   } else {
  //     console.log("SynchronizationComponent: No payment changes required.");
  //   }
  // }, [users, packages, updateUserPayments]);

  /**
   * Initialize monthly payments for users based on package details.
   */
  useEffect(() => {
    if (!packages.length || !users.length) {
      console.log(
        "SynchronizationComponent: Skipping monthly payment initialization."
      );
      return;
    }

    console.log("SynchronizationComponent: Initializing monthly payments...");
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let hasChanges = false;

    const updatedUsers = users.map((user) => {
      if (!user.payments) user.payments = [];

      const hasPayment = user.payments.some((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });

      if (!hasPayment) {
        const packageDetails = packages.find(
          (pkg) => pkg.id === user.packageId
        );
        if (!packageDetails) {
          console.warn(
            `Cannot initialize payment for user ${user.name} (${user.id}): Missing package details.`
          );
          return user;
        }

        const discount =
          user.discountType === "everytime"
            ? user.discount || 0
            : user.payments.some(
                (p) =>
                  p.discountedAmount < packageDetails.cost &&
                  p.status !== "Pending"
              )
            ? 0
            : user.discount || 0;

        const dueDate = new Date(
          currentYear,
          currentMonth + 1,
          1
        ).toISOString();

        const newPayment: Payment = {
          id: `${user.id}-${currentMonth}-${currentYear}`,
          userId: user.id,
          packageId: user.packageId,
          discountedAmount: Math.max(packageDetails.cost - discount, 0),
          status: "Pending",
          date: now.toISOString(),
          dueDate,
        };

        hasChanges = true;
        return {
          ...user,
          payments: [...user.payments, newPayment],
          dueDate,
        };
      }

      return user;
    });

    if (hasChanges) {
      setUsers(updatedUsers);
      console.log("SynchronizationComponent: Monthly payments initialized.");
    } else {
      console.log(
        "SynchronizationComponent: All users already have payments for the current month."
      );
    }
  }, [users, packages, setUsers]);

  return null;
};

export default SynchronizationComponent;
