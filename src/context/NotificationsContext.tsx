import { createContext, useContext } from "react";
import { Notification } from "../types/notifications";

interface NotificationsContextType {
  notifications: Notification[];
  selectedUsers: string[];
  selectedPayments: string[];
  fetchNotifications: () => void;
  addNotification: (
    title: string,
    body: string,
    userIds: string[],
    packageId?: string
  ) => void;
  updateNotificationStatus: (id: string, status: "Sent" | "Pending") => void;
  toggleUserSelection: (id: string) => void;
  toggleSelectAllUsers: (allUsers: string[]) => void;
  togglePaymentSelection: (paymentId: string) => void;
  toggleSelectAllPayments: (allPayments: string[]) => void;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
