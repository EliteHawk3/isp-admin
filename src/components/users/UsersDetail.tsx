import { motion } from "framer-motion";
import {
  FaUserAlt,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaMoneyBillAlt,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaPercent,
  FaCalendarAlt,
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUndo,
} from "react-icons/fa";
import { MdPaid, MdErrorOutline } from "react-icons/md";
import { useState } from "react";
import { User } from "../../types/users";
import { FC } from "react";
import { IconType } from "react-icons"; // Type for react-icons components

// Define the prop types
interface DetailCardProps {
  icon: IconType; // Type for the Icon component
  label: string; // Label text (e.g., "Name", "CNIC")
  value: string | null; // Value text (e.g., user.name) or null for optional values
  iconColor: string; // Gradient color for the icon's background
}

// Functional component with explicit typing
const DetailCard: FC<DetailCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor,
}) => (
  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
    {/* Icon */}
    <div
      className={`p-3 bg-gradient-to-r ${iconColor} text-white rounded-full shadow-md`}
    >
      <Icon className="text-xl" />
    </div>

    {/* Label and Value */}
    <div>
      <span className="block text-sm text-gray-400">{label}</span>
      <span className="block text-lg font-semibold text-gray-200">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

// Custom hooks
import { usePackages } from "../../context/PackagesContext";
import { useUsers } from "../../context/UsersContext";

import UserForm from "./UsersForm";
import PaymentHistory from "../payments/PaymentsHistory";

/** A helper for more readable date output */
function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short", // e.g. "Mon"
    year: "numeric", // e.g. "2025"
    month: "short", // e.g. "Jan"
    day: "numeric", // e.g. "20"
  });
}

interface UsersDetailProps {
  /** The user object to display. If null, the component shows a placeholder. */
  user: User | null;
}

const UsersDetail: React.FC<UsersDetailProps> = ({ user }) => {
  const { packages } = usePackages();
  const { deleteUser, markAsPaid, markAsUnpaid, editUser } = useUsers();
  const [showPaymentHistory, setShowPaymentHistory] = useState(false); // Modal state

  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [modalType, setModalType] = useState<
    "markAsPaid" | "markAsUnpaid" | null
  >(null);

  // If there's no user selected, prompt to select one
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a user to view details.
      </div>
    );
  }

  // Grab package info for the user
  const packageDetails = packages.find((pkg) => pkg.id === user.packageId);

  // Generate a fun avatar using DiceBear

  // const profileImage = `https://api.dicebear.com/5.x/adventurer/svg?seed=${user.id}`;

  // Determine current month payment (matching current year/month)
  const now = new Date();
  const currentPayment = user.payments?.find((payment) => {
    const paymentDate = new Date(payment.date);
    return (
      paymentDate.getMonth() === now.getMonth() &&
      paymentDate.getFullYear() === now.getFullYear()
    );
  });

  /**
   * Dynamically set background color for current payment status.
   */
  const paymentBackgroundColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-gradient-to-br from-green-900 via-green-700 to-green";
      case "Overdue":
        return "bg-gradient-to-br from-red-900 via-red-700 to-red";
      case "Pending":
        return "bg-gradient-to-br from-teal-900 via-teal-700 to-teal";
      default:
        return "bg-gray-700";
    }
  };

  /**
   * Calculates the current amount due, factoring in discount type:
   * - "everytime" always applies discount
   * - "one-time" applies discount only if current payment is "Pending"
   */
  const calculateAmountDue = (): { amount: number; details: string } => {
    if (!packageDetails) {
      return { amount: 0, details: "No package assigned." };
    }

    const originalAmount = packageDetails.cost;
    let discount = 0;
    let discountDetails = "No discount applied.";

    if (user.discountType === "everytime") {
      discount = user.discount || 0;
      discountDetails = `Discount (Everytime): -$${discount}`;
    } else if (
      user.discountType === "one-time" &&
      currentPayment?.status === "Pending"
    ) {
      discount = user.discount || 0;
      discountDetails = `Discount (One-time): -$${discount}`;
    }

    const amount = Math.max(originalAmount - discount, 0);
    return {
      amount,
      details: `${discountDetails}. Final Amount: $${amount}`,
    };
  };

  /**
   * Payment modal logic for marking a payment as Paid/Unpaid
   */
  const handleMarkAsPaid = () => {
    setModalType("markAsPaid");
    setShowPaymentModal(true);
  };

  const handleMarkAsUnpaid = () => {
    setModalType("markAsUnpaid");
    setShowPaymentModal(true);
  };

  const handleConfirmAction = () => {
    if (modalType === "markAsPaid" && currentPayment) {
      // Use discount logic for the newly paid amount
      const { amount } = calculateAmountDue();
      markAsPaid(user.id, currentPayment.id, new Date().toISOString(), amount);
    } else if (modalType === "markAsUnpaid" && currentPayment) {
      markAsUnpaid(user.id, currentPayment.id);
    }
    setShowPaymentModal(false);
    setModalType(null);
  };

  /**
   * Handle deleting the user from context
   * (the parent effect in UsersPage will clear the detail if user is gone).
   */
  const handleDeleteUser = () => {
    setShowDeleteModal(true); // Show confirmation modal
  };

  const confirmDeleteUser = () => {
    deleteUser(user.id); // Call delete function from context
    setShowDeleteModal(false); // Close modal
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl w-full lg:w-2/4  shadow-2xl flex flex-col"
    >
      {isEditing ? (
        // If editing, show an inline UserForm
        <UserForm
          user={user}
          packages={packages}
          // onSubmit={() => setIsEditing(false)}
          onSubmit={(updatedUser) => {
            editUser(updatedUser); // <--- Actually call context to update
            setIsEditing(false); // Then close the form
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Avatar */}
          {/* <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <img
              src={profileImage}
              alt={`${user.name}'s Profile`}
              className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
            />
          </motion.div> */}
          <div className="mb-8">
            {/* Header */}
            {/* <h2 className="text-2xl font-extrabold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              User Details
            </h2> */}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 ">
              {/* Name */}
              <DetailCard
                icon={FaUserAlt}
                label="Name"
                value={user.name}
                iconColor="from-purple-500 to-indigo-500"
              />

              {/* CNIC */}
              {user.cnic && (
                <DetailCard
                  icon={FaIdCard}
                  label="CNIC"
                  value={user.cnic}
                  iconColor="from-blue-500 to-cyan-500"
                />
              )}

              {/* Phone */}
              <DetailCard
                icon={FaPhone}
                label="Phone"
                value={user.phone}
                iconColor="from-purple-500 to-pink-500"
              />

              {/* Address */}
              <DetailCard
                icon={FaMapMarkerAlt}
                label="Address"
                value={user.address || "No Address"}
                iconColor="from-red-500 to-orange-500"
              />

              {/* Created On */}
              <DetailCard
                icon={FaCalendarAlt}
                label="Created On"
                value={formatDate(user.createdAt)}
                iconColor="from-blue-500 to-indigo-500"
              />

              {/* Due On */}
              <DetailCard
                icon={FaCalendarCheck}
                label="Due On"
                value={formatDate(currentPayment?.dueDate)}
                iconColor="from-red-500 to-pink-500"
              />
            </div>
          </div>
          {/* <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text mb-4 ">
            Package Details
          </h2> */}
          {packageDetails ? (
            <div className="flex gap-4 mb-6">
              {/* Package Name */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
                <FaBoxOpen className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Package</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {packageDetails.name}
                  </p>
                </div>
              </div>

              {/* Speed */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
                <FaTachometerAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Speed</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {packageDetails.speed} Mbps
                  </p>
                </div>
              </div>

              {/* Cost */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
                <FaMoneyBillAlt className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Cost</p>
                  <p className="text-lg font-semibold text-gray-200">
                    ${packageDetails.cost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mb-6">No package assigned.</p>
          )}
          {/* <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text mb-4">
            Financial Details
          </h2> */}
          <div className="flex gap-4 mb-6">
            {/* Installation Cost */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
              <FaMoneyBillAlt className="text-green-400 text-xl" />
              <div>
                <p className="text-sm text-gray-400">Installation</p>
                <p className="text-lg font-semibold text-gray-200">
                  ${user.installationCost.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Discount - Only show if > 0 */}
            {(user.discount ?? 0) > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
                <FaMoneyBillAlt className="text-yellow-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Discount</p>
                  <p className="text-lg font-semibold text-gray-200">
                    ${user.discount?.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Discount Type - Only show if discount exists */}
            {(user.discount ?? 0) > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md flex-1">
                <FaPercent className="text-yellow-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Discount Type</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {user.discountType}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Current Payment */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Payment</h2>

            {/* Payment History Button with Animation */}
            <button
              onClick={() => setShowPaymentHistory(true)} // Show modal
              className="animate-bounce bg-gradient-to-r from-teal-500 to-blue-500 px-4 py-2 text-white rounded-full shadow-md hover:from-teal-600 hover:to-blue-600 flex items-center gap-2 relative "
              title="View Payment History"
            >
              <FaFileInvoiceDollar className="text-lg" />
              <span className="text-sm font-medium">Payment History</span>
              {/* Glow Effect */}
            </button>
          </div>

          {currentPayment ? (
            <div
              className={`p-4 rounded-lg text-white shadow-md flex items-center justify-between gap-4 ${paymentBackgroundColor(
                currentPayment.status
              )}`}
            >
              {/* Status */}
              <div className="flex flex-col items-start">
                <p className="text-sm text-gray-300">Status</p>
                <p className="text-lg font-semibold">{currentPayment.status}</p>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-start">
                <p className="text-sm text-gray-300">Amount</p>
                <p className="text-lg font-semibold">
                  ${currentPayment.discountedAmount.toFixed(2)}
                </p>
              </div>

              {/* Due Date */}
              {currentPayment.dueDate && currentPayment.status !== "Paid" && (
                <div className="flex flex-col items-start">
                  <p className="text-sm text-gray-300">Due On</p>
                  <p className="text-lg font-semibold">
                    {formatDate(currentPayment.dueDate)}
                  </p>
                </div>
              )}

              {/* Paid Date */}
              {currentPayment.paidDate && currentPayment.status === "Paid" && (
                <div className="flex flex-col items-start">
                  <p className="text-sm text-gray-300">Paid On</p>
                  <p className="text-lg font-semibold">
                    {formatDate(currentPayment.paidDate)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 mb-6">
              No payment details available for this month.
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {currentPayment?.status !== "Paid" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleMarkAsPaid}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-lg flex items-center gap-2 shadow-md"
              >
                <MdPaid />
                Mark as Paid
              </motion.button>
            )}
            {currentPayment?.status === "Paid" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleMarkAsUnpaid}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg flex items-center gap-2 shadow-md"
              >
                <MdErrorOutline />
                Mark as Unpaid
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg flex items-center gap-2 shadow-md"
            >
              <FaEdit />
              Edit User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleDeleteUser} // Show modal instead of `window.confirm`
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg flex items-center gap-2 shadow-md"
            >
              <FaTrash />
              Delete User
            </motion.button>
          </div>
        </>
      )}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        >
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-400 text-2xl" />
              <h3 className="text-xl font-semibold text-white">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-400 mb-6 text-center">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">{user.name}</span>? This
              action{" "}
              <span className="text-red-500 font-semibold">
                cannot be undone.
              </span>
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      {showPaymentModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        >
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              {modalType === "markAsPaid" ? (
                <FaCheckCircle className="text-green-400 text-2xl animate-pulse" />
              ) : (
                <FaUndo className="text-yellow-400 text-2xl" />
              )}
              <h3 className="text-xl font-semibold text-white">
                {modalType === "markAsPaid"
                  ? "Confirm Payment"
                  : "Revert Payment"}
              </h3>
            </div>
            {modalType === "markAsPaid" && (
              <p className="text-gray-400 mb-6 text-center">
                {calculateAmountDue().details}
              </p>
            )}
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-all ${
                  modalType === "markAsPaid"
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-yellow-500 hover:bg-yellow-400"
                }`}
              >
                Confirm
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <PaymentHistory
          selectedUserId={user.id} // Pass user ID
          onClose={() => setShowPaymentHistory(false)} // Close modal
        />
      )}
    </motion.div>
  );
};

export default UsersDetail;
