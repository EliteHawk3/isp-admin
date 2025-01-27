import { useState, useCallback, useEffect, ReactNode } from "react";
import { NotificationsContext } from "./NotificationsContext";
import { Notification } from "../types/notifications";
import { mockNotifications } from "../data/notifications"; // Ensure mock data is imported
import { useUsers } from "./UsersContext";
import { usePackages } from "./PackagesContext";

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const { users } = useUsers();
  const { packages } = usePackages();

  // Fetch notifications from mock data
  const fetchNotifications = useCallback(() => {
    setNotifications(mockNotifications);
    console.log("Notifications fetched:", mockNotifications);
  }, []);

  // Add a new notification
  //   import { User, Payment } from "../types"; // Assuming these types exist

  const addNotification = (
    title: string,
    body: string,
    paymentIds: string[],
    packageId?: string
  ) => {
    // Map paymentIds to userIds
    const referencedUsers = users.filter((user) =>
      user.payments.some((payment) => paymentIds.includes(payment.id))
    );

    if (referencedUsers.length === 0) {
      console.warn("No valid users found for notification.");
      return;
    }

    // Validate package
    const relatedPackage = packageId
      ? packages.find((pkg) => pkg.id === packageId)
      : undefined;

    // Collect payments associated with the provided paymentIds
    const relatedPayments = referencedUsers.flatMap((user) =>
      user.payments.filter((payment) => paymentIds.includes(payment.id))
    );

    const newNotification: Notification = {
      id: String(Date.now()),
      title,
      body,
      date: new Date().toISOString(),
      status: "Pending",
      users: referencedUsers,
      relatedPackage,
      payments: relatedPayments,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    console.log("Notification added:", newNotification);
  };

  // Update notification status
  const updateNotificationStatus = useCallback(
    (id: string, status: "Sent" | "Pending") => {
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, status } : notif))
      );
      console.log(`Notification ${id} status updated to:`, status);
    },
    []
  );

  // Toggle user selection
  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  // Select/Deselect all users
  const toggleSelectAllUsers = (allUsers: string[]) => {
    setSelectedUsers((prev) =>
      prev.length === allUsers.length ? [] : allUsers
    );
  };

  // Toggle payment selection
  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(
      (prev) =>
        prev.includes(paymentId)
          ? prev.filter((id) => id !== paymentId) // Deselect payment
          : [...prev, paymentId] // Select payment
    );
  };

  // Select/Deselect all payments
  const toggleSelectAllPayments = (allPayments: string[]) => {
    setSelectedPayments((prev) =>
      prev.length === allPayments.length ? [] : allPayments
    );
  };

  // Initialize notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        selectedUsers,
        selectedPayments,
        fetchNotifications,
        addNotification,
        updateNotificationStatus,
        toggleUserSelection,
        toggleSelectAllUsers,
        togglePaymentSelection,
        toggleSelectAllPayments,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
