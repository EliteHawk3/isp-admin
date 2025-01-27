import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNotifications } from "../../context/NotificationsContext";
import { useUsers } from "../../context/UsersContext";

const NotificationsSummary: FC = () => {
  const { addNotification, selectedPayments } = useNotifications();
  const { users } = useUsers();
  const [showInvalidModal, setShowInvalidModal] = useState(false); // Modal for invalid payments
  const [showNoPaymentsModal, setShowNoPaymentsModal] = useState(false); // Modal for no payments selected

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessRibbon, setShowSuccessRibbon] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({
    title: "",
    body: "",
  });

  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
  const [invalidPayments, setInvalidPayments] = useState<string[]>([]);

  // Update selected users dynamically when `selectedPayments` changes
  useEffect(() => {
    const userNames = selectedPayments
      .map((paymentId) => {
        const user = users.find((user) =>
          user.payments.some((payment) => payment.id === paymentId)
        );
        return user ? user.name : null;
      })
      .filter(Boolean) as string[];

    setSelectedUserNames(userNames);
  }, [selectedPayments, users]);

  const validatePayments = (notificationType: string) => {
    const invalid = selectedPayments.filter((paymentId) => {
      const user = users.find((user) =>
        user.payments.some((payment) => payment.id === paymentId)
      );
      const payment = user?.payments.find(
        (payment) => payment.id === paymentId
      );

      if (!payment) return false;

      // Validation logic: disallow reminders for paid payments
      if (notificationType === "due" || notificationType === "unpaid") {
        return payment.status === "Paid";
      }

      return false;
    });

    setInvalidPayments(invalid);
    return invalid.length === 0;
  };

  const handleSend = (title: string, body: string, type: string) => {
    if (selectedPayments.length === 0) {
      setShowNoPaymentsModal(true); // Show modal for no payments selected
      return;
    }

    if (!validatePayments(type)) {
      setShowInvalidModal(true); // Show modal for invalid payments
      return;
    }

    setCurrentNotification({ title, body });
    setShowEditModal(true);
  };

  const confirmSend = () => {
    addNotification(
      currentNotification.title,
      currentNotification.body,
      selectedPayments
    );
    setShowEditModal(false);
    setShowConfirmationModal(false);
    setShowSuccessRibbon(true);

    // Automatically hide the success ribbon after 4 seconds
    setTimeout(() => {
      setShowSuccessRibbon(false);
    }, 8000);
  };

  const buttons = [
    {
      label: "Due Date Reminder",
      gradient: "from-blue-500 to-indigo-500",
      action: () =>
        handleSend(
          "Payment Due Reminder",
          "Your payment is due soon. Please pay before the due date.",
          "due"
        ),
    },
    {
      label: "Unpaid Reminder",
      gradient: "from-yellow-500 to-orange-500",
      action: () =>
        handleSend(
          "Overdue Payment Notice",
          "You have overdue payments. Please settle your bill as soon as possible.",
          "unpaid"
        ),
    },
    {
      label: "Promotion Alert",
      gradient: "from-green-500 to-teal-500",
      action: () =>
        handleSend(
          "Special Promotion",
          "Upgrade your plan now and get 20% off for a limited time!",
          "promotion"
        ),
    },
    {
      label: "Custom Notification",
      gradient: "from-purple-500 to-pink-500",
      action: () => handleSend("", "", "custom"),
    },
  ];

  return (
    <div className="flex justify-center items-center gap-6 mb-6">
      {buttons.map((btn, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-r ${btn.gradient} text-white px-10 py-5 rounded-xl shadow-lg text-xl font-bold`}
          onClick={btn.action}
        >
          {btn.label}
        </motion.button>
      ))}

      {/* Edit Notification Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit Notification</h2>
            <p className="text-sm text-gray-400 mb-4">
              Sending notification to{" "}
              <strong>{selectedUserNames.length}</strong> users:{" "}
              {selectedUserNames.join(", ")}
            </p>
            <label className="block mb-4">
              <span className="text-sm text-gray-400">Title</span>
              <input
                type="text"
                value={currentNotification.title}
                onChange={(e) =>
                  setCurrentNotification({
                    ...currentNotification,
                    title: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm text-gray-400">Body</span>
              <textarea
                value={currentNotification.body}
                onChange={(e) =>
                  setCurrentNotification({
                    ...currentNotification,
                    body: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </label>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowConfirmationModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-bold mb-4">Confirm Notification</h2>
            <p className="mb-4">
              Are you sure you want to send the following notification to{" "}
              <strong>{selectedUserNames.length}</strong> users?
            </p>
            <p className="mb-4">
              <strong>Title:</strong> {currentNotification.title}
            </p>
            <p className="mb-4">
              <strong>Body:</strong> {currentNotification.body}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Invalid Payments Modal */}
      {showInvalidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-bold mb-4">Invalid Notification</h2>
            <p className="text-sm text-gray-400 mb-4">
              The following users cannot receive this notification due to
              invalid status:
            </p>
            <ul className="mb-4 text-sm text-gray-300 list-disc pl-5">
              {invalidPayments.map((paymentId) => {
                const user = users.find((user) =>
                  user.payments.some((payment) => payment.id === paymentId)
                );

                return (
                  <li key={paymentId}>
                    {user ? (
                      <>
                        User: <strong>{user.name}</strong> (Payment ID:{" "}
                        {paymentId})
                      </>
                    ) : (
                      <>
                        Payment ID: <strong>{paymentId}</strong> (User Not
                        Found)
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInvalidModal(false)}
                className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showNoPaymentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-bold mb-4">No Payments Selected</h2>
            <p className="text-sm text-gray-400 mb-4">
              Please select at least one payment to send the notification.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNoPaymentsModal(false)}
                className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Ribbon */}
      {showSuccessRibbon && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span>Notification Sent Successfully!</span>
          <motion.div
            className="h-1 bg-white rounded-full"
            style={{ width: "100%" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 8 }}
          ></motion.div>
        </div>
      )}
    </div>
  );
};

export default NotificationsSummary;
