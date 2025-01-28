import React from "react";
import { useUsers } from "../../context/UsersContext";
import { useMemo } from "react";
import { User } from "../../types/users";
import { Payment } from "../../types/payments";
import { usePackages } from "../../context/PackagesContext";
const RecentTransactions: React.FC = () => {
  const { users } = useUsers();
  const { packages } = usePackages();
  const getPackageNameById = (packageId: string): string =>
    packages.find((pkg) => pkg.id === packageId)?.name || "Unknown Package";

  // Get all paid payments across all users with user info
  const transactions = useMemo(() => {
    return users
      .flatMap((user: User) =>
        user.payments
          .filter(
            (payment: Payment) => payment.status === "Paid" && payment.paidDate
          )
          .map((payment: Payment) => ({
            ...payment,
            userName: user.name,
            userPhone: user.phone,
            userPackage: user.packageId,
          }))
      )
      .sort(
        (a, b) =>
          new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime()
      )
      .slice(0, 5); // Show last 5 transactions
  }, [users]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="space-y-4 ">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center p-4 rounded-lg bg-gray-900 hover:bg-gray-700 transition duration-300"
          >
            {/* User Info */}
            <div className="flex-1">
              <p className="text-blue-400 font-semibold">
                {transaction.userName}
              </p>
              <p className="text-gray-400 text-sm">
                {getPackageNameById(transaction.userPackage)}
              </p>{" "}
            </div>

            {/* Payment Date */}
            <div className="w-28 text-gray-400 text-sm text-center">
              {new Date(transaction.paidDate!).toLocaleDateString()}
            </div>

            {/* Payment Amount */}
            <div className="w-24 text-right">
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                ${transaction.discountedAmount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-gray-400 text-center py-4">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
