import { motion } from "framer-motion";
import {
  FaUndo,
  FaCheck,
  FaTrashAlt,
  FaClock,
  FaExclamationCircle,
  FaListAlt,
} from "react-icons/fa";
import { Payment } from "../../types/payments";
import { useState } from "react";
interface PaymentsListProps {
  payments: Payment[];
  handleMarkAsPaid: (userId: string, paymentId: string, amount: number) => void;
  handleMarkAsUnpaid: (userId: string, paymentId: string) => void;
  handleDeletePayment: (userId: string, paymentId: string) => void;
  getUserNameById: (userId: string) => string;
  getPackageDetailsById: (packageId: string) => { name: string; price: number };
  onViewHistory: (userId: string) => void; // Add this line
}

const PaymentsList = ({
  payments,
  handleMarkAsPaid,
  handleMarkAsUnpaid,
  handleDeletePayment,
  getUserNameById,
  getPackageDetailsById,
  onViewHistory,
}: PaymentsListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    action: string;
    userId: string;
    paymentId: string;
    message: string;
  } | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const openModal = (
    action: string,
    userId: string,
    paymentId: string,
    message: string
  ) => {
    setModalData({ action, userId, paymentId, message });
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalData) {
      const { action, userId, paymentId } = modalData;
      if (action === "markAsPaid") {
        handleMarkAsPaid(
          userId,
          paymentId,
          payments.find((p) => p.id === paymentId)!.discountedAmount
        );
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
      {/* Modal */}
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
      <div
        className="overflow-y-auto max-h-[60vh] overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-md"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#2563EB #1F2937",
        }}
      >
        {payments.map((payment) => {
          const userName = getUserNameById(payment.userId);
          const packageDetails = getPackageDetailsById(payment.packageId);

          const cardColor =
            payment.status === "Paid"
              ? "bg-gray-800 border-green-500"
              : payment.status === "Pending"
              ? "bg-gray-800 border-teal-500"
              : "bg-gray-800 border-red-500";

          const statusIcon =
            payment.status === "Paid" ? (
              <FaCheck className="text-green-500" />
            ) : payment.status === "Pending" ? (
              <FaClock className="text-teal-500" />
            ) : (
              <FaExclamationCircle className="text-red-500" />
            );

          return (
            <motion.div
              key={payment.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-transform flex justify-between items-center border-l-4 ${cardColor} mb-4`}
            >
              {/* Payment Details */}
              <div>
                <div className="flex items-center gap-2">
                  {statusIcon}
                  <h3 className="text-base font-bold text-white">{userName}</h3>
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold">Package:</span>{" "}
                  {packageDetails.name} (${packageDetails.price.toFixed(2)})
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Amount:</span> $
                  {payment.discountedAmount.toFixed(2)}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Due Date:</span>{" "}
                  {formatDate(payment.dueDate)}
                </p>
                {payment.paidDate && (
                  <p className="text-gray-300">
                    <span className="font-semibold">Paid Date:</span>{" "}
                    {formatDate(payment.paidDate)}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end gap-3">
                {/* View History Icon */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  onClick={() => onViewHistory(payment.userId)}
                  className="cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 text-blue-400 p-3 rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 hover:text-blue-300 flex items-center justify-center"
                  title="View History"
                >
                  <FaListAlt className="text-xl" />
                </motion.div>

                {/* Paid and Delete Buttons */}
                <div className="flex gap-2">
                  {payment.status === "Paid" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
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
                      className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white px-4 py-2 rounded-lg shadow-sm hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-1 text-sm"
                    >
                      <FaUndo className="text-yellow-300" /> Mark as Unpaid
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
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
                      className="bg-gradient-to-br from-green-600 to-green-700 text-white px-4 py-2 rounded-lg shadow-sm hover:from-green-500 hover:to-green-600 flex items-center gap-1 text-sm"
                    >
                      <FaCheck className="text-green-300" /> Mark as Paid
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
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
                    className="bg-gradient-to-br from-red-600 to-red-700 text-white px-4 py-2 rounded-lg shadow-sm hover:from-red-500 hover:to-red-600 flex items-center gap-1 text-sm"
                  >
                    <FaTrashAlt className="text-red-300" /> Delete
                  </motion.button>
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
