import React, { useState } from "react";
import { motion } from "framer-motion"; // For animations
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa"; // Icons for statuses
import { Payment } from "../../types/payments";

interface PaymentHistoryProps {
  payments: Payment[];
  onClose: () => void;
  getUserNameById: (userId: string) => string;
  getPackageDetailsById: (packageId: string) => { name: string; price: number };
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  onClose,
  getUserNameById,
  getPackageDetailsById,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments = payments.filter((payment) =>
    filter === "all" ? true : payment.status === filter
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case "Pending":
        return <FaClock className="text-yellow-500 text-lg" />;
      case "Overdue":
        return <FaExclamationCircle className="text-red-500 text-lg" />;
      default:
        return <FaTimesCircle className="text-gray-500 text-lg" />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[600px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment History</h2>
          <button
            onClick={onClose}
            className="bg-red-600 px-3 py-2 rounded-full shadow-lg hover:bg-red-700"
          >
            <FaTimesCircle className="text-white text-lg" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex justify-center gap-4 mb-4">
          {["all", "Paid", "Pending", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === status ? "bg-blue-600 text-white" : "bg-gray-700"
              }`}
            >
              {getStatusIcon(status === "all" ? "" : status)}
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="overflow-y-auto max-h-96">
          {filteredPayments.map((payment) => {
            const userName = getUserNameById(payment.userId);
            const packageDetails = getPackageDetailsById(payment.packageId);

            return (
              <div
                key={payment.id}
                className="p-4 bg-gray-800 rounded-lg mb-4 border-l-4 flex items-center justify-between"
                style={{
                  borderColor:
                    payment.status === "Paid"
                      ? "green"
                      : payment.status === "Pending"
                      ? "yellow"
                      : "red",
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(payment.status)}
                    <h3 className="text-lg font-semibold">{userName}</h3>
                  </div>
                  <p className="text-sm">
                    <strong>Package:</strong> {packageDetails.name} ($
                    {packageDetails.price.toFixed(2)})
                  </p>
                  <p className="text-sm">
                    <strong>Amount:</strong> $
                    {payment.discountedAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong> {payment.status}
                  </p>
                  <p className="text-sm">
                    <strong>Due Date:</strong> {formatDate(payment.dueDate)}
                  </p>
                  {payment.paidDate && (
                    <p className="text-sm">
                      <strong>Paid Date:</strong> {formatDate(payment.paidDate)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentHistory;
