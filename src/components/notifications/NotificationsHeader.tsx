import { FC, useMemo } from "react";
import { Payment } from "../../types/payments";

interface NotificationsHeaderProps {
  selectedCategory: string;
  filteredPayments: Payment[];
}

const NotificationsHeader: FC<NotificationsHeaderProps> = ({
  selectedCategory,
  filteredPayments,
}) => {
  // Calculate the count of payments for the selected category
  const filteredPaymentCount = useMemo(() => {
    return filteredPayments.filter((payment) => {
      const status = payment.status.toLowerCase();
      switch (selectedCategory.toLowerCase()) {
        case "paid":
          return status === "paid";
        case "pending":
          return status === "pending";
        case "overdue":
          return status === "overdue";
        case "all":
          return true;
        default:
          return false;
      }
    }).length;
  }, [filteredPayments, selectedCategory]);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide">Notifications</h1>
        <p className="text-sm text-gray-400 mt-2">
          Showing {filteredPaymentCount} payments for{" "}
          <strong className="capitalize">{selectedCategory}</strong>
        </p>
      </div>
    </header>
  );
};

export default NotificationsHeader;
