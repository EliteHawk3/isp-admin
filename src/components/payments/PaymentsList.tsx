import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Payment } from "../../types/payments";
import {
  FaUndo,
  FaCheck,
  FaTrashAlt,
  FaListAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";
import { useUsers } from "../../context/UsersContext"; // Use UsersContext
import { usePackages } from "../../context/PackagesContext"; // Use PackagesContext
interface PaymentsListProps {
  payments: Payment[]; // Accept filtered payments directly
  handleMarkAsPaid: (userId: string, paymentId: string, amount: number) => void;
  handleMarkAsUnpaid: (userId: string, paymentId: string) => void;
  handleDeletePayment: (userId: string, paymentId: string) => void;
  onViewHistory: (userId: string) => void; // View user payment history
}

const PaymentsList: React.FC<PaymentsListProps> = ({
  handleMarkAsPaid,
  handleMarkAsUnpaid,
  handleDeletePayment,
  onViewHistory,
  payments,
}) => {
  const { users } = useUsers(); // Access users from context
  const { packages } = usePackages(); // Access packages from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    action: string;
    userId: string;
    paymentId: string;
    message: string;
  } | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Helper functions to fetch user name and package details
  const getUserNameById = (userId: string) =>
    users.find((user) => user.id === userId)?.name || "Unknown User";

  const getPackageDetailsById = (packageId: string) =>
    packages.find((pkg) => pkg.id === packageId) || {
      name: "Unknown",
      cost: 0,
    };

  // Filter payments dynamically based on context
  const filteredPayments = useMemo(() => {
    return users.flatMap((user) =>
      user.payments.filter((payment) => {
        const paymentDate = new Date(payment.date || "");
        const paidDate = new Date(payment.paidDate || "");
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        const paidYear = paidDate.getFullYear();
        const paidMonth = paidDate.getMonth();

        const isCurrentMonthPayment =
          paymentYear === currentYear && paymentMonth === currentMonth;

        const isPaidInCurrentMonth =
          payment.status === "Paid" &&
          paidYear === currentYear &&
          paidMonth === currentMonth;

        const isPreviousMonthsPendingOrOverdue =
          ["Pending", "Overdue"].includes(payment.status) &&
          (paymentYear < currentYear ||
            (paymentYear === currentYear && paymentMonth < currentMonth));

        // Include:
        // - Payments for the current month (all statuses)
        // - Payments paid in the current month, regardless of original due date
        // - Previous months' pending or overdue payments
        return (
          isCurrentMonthPayment ||
          isPaidInCurrentMonth ||
          isPreviousMonthsPendingOrOverdue
        );
      })
    );
  }, [users, currentMonth, currentYear]);

  // Format date for display
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Open confirmation modal
  const openModal = (
    action: string,
    userId: string,
    paymentId: string,
    message: string
  ) => {
    setModalData({ action, userId, paymentId, message });
    setIsModalOpen(true);
  };

  // Handle modal confirmation
  const handleConfirm = () => {
    if (modalData) {
      const { action, userId, paymentId } = modalData;
      if (action === "markAsPaid") {
        const payment = filteredPayments.find((p) => p.id === paymentId);
        if (payment) {
          handleMarkAsPaid(userId, paymentId, payment.discountedAmount);
        }
      } else if (action === "markAsUnpaid") {
        handleMarkAsUnpaid(userId, paymentId);
      } else if (action === "delete") {
        handleDeletePayment(userId, paymentId);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      {isModalOpen && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]"
          >
            <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
            <p className="mb-6">{modalData.message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payments List */}
      <div className="overflow-y-auto max-h-[60vh] custom-scrollbar space-y-4">
        {payments.map((payment) => {
          const userName = getUserNameById(payment.userId);
          const packageDetails = getPackageDetailsById(payment.packageId);

          const statusIcon =
            payment.status === "Overdue" ? (
              <FaExclamationCircle className="text-red-500 text-xl" />
            ) : payment.status === "Pending" ? (
              <FaClock className="text-teal-500 text-xl" />
            ) : (
              <FaCheckCircle className="text-green-500 text-xl" />
            );

          // Display either Paid Date or Due Date
          const dateLabel =
            payment.status === "Paid"
              ? `Paid Date: ${formatDate(payment.paidDate || "")}`
              : `Due Date: ${formatDate(payment.dueDate || "")}`;

          return (
            <motion.div
              key={payment.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 shadow-md hover:shadow-lg transition-transform flex justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-l-2"
              style={{
                borderColor:
                  payment.status === "Overdue"
                    ? "red"
                    : payment.status === "Pending"
                    ? "teal"
                    : "green",
              }}
            >
              {/* User Details */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {userName}
                    {statusIcon}
                  </h3>
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Package:</strong> {packageDetails.name} |{" "}
                  <strong>Price:</strong> ${packageDetails.cost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Amount:</strong> ${" "}
                  {payment.discountedAmount.toFixed(2)} |{" "}
                  <strong>{dateLabel}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => onViewHistory(payment.userId)}
                  className="text-blue-500 hover:text-blue-700"
                  title="View History"
                >
                  <FaListAlt className="text-xl" />
                </button>
                <div className="flex gap-2">
                  {payment.status === "Paid" ? (
                    <button
                      onClick={() =>
                        openModal(
                          "markAsUnpaid",
                          payment.userId,
                          payment.id,
                          `Mark payment of $${payment.discountedAmount.toFixed(
                            2
                          )} for ${userName} as Unpaid?`
                        )
                      }
                      className=" whitespace-nowrap bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-2 shadow-sm hover:from-purple-600 hover:to-purple-800 flex items-center gap-x-2 text-sm"
                    >
                      <FaUndo />
                      Mark as Unpaid
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openModal(
                          "markAsPaid",
                          payment.userId,
                          payment.id,
                          `Mark payment of $${payment.discountedAmount.toFixed(
                            2
                          )} for ${userName} as Paid?`
                        )
                      }
                      className="whitespace-nowrap bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-2 shadow-sm hover:from-green-600 hover:to-green-800 flex items-center gap-1 text-sm"
                    >
                      <FaCheck />
                      Mark as Paid
                    </button>
                  )}
                  <button
                    onClick={() =>
                      openModal(
                        "delete",
                        payment.userId,
                        payment.id,
                        `Delete payment of $${payment.discountedAmount.toFixed(
                          2
                        )} for ${userName}?`
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                    title="Delete Payment"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default PaymentsList;
