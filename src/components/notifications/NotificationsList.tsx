import { FC } from "react";
import { FaUser } from "react-icons/fa";
import { Payment } from "../../types/payments";
import { useNotifications } from "../../context/NotificationsContext";
import { useUsers } from "../../context/UsersContext";
import { usePackages } from "../../context/PackagesContext";

interface NotificationsListProps {
  payments: Payment[]; // Filtered payments passed from parent
}

const NotificationsList: FC<NotificationsListProps> = ({ payments }) => {
  const { selectedPayments, togglePaymentSelection, toggleSelectAllPayments } =
    useNotifications();
  const { users } = useUsers();
  const { packages } = usePackages();

  // Format date into readable format
  const formatDate = (date: string | undefined): string =>
    date ? new Date(date).toLocaleDateString() : "Not Paid Yet";

  // Get user and package details dynamically
  const getUserNameById = (userId: string): string =>
    users.find((user) => user.id === userId)?.name || "Unknown User";

  const getPackageNameById = (packageId: string): string =>
    packages.find((pkg) => pkg.id === packageId)?.name || "Unknown Package";

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-md max-h-[80vh] overflow-y-auto custom-scrollbar">
      {/* Header with Redesigned "Select All" Toggle */}
      <div
        className={`relative w-12 h-6 bg-gradient-to-r ${
          selectedPayments.length === payments.length
            ? "from-green-500 to-teal-500"
            : "from-gray-600 to-gray-800"
        } rounded-full shadow-inner cursor-pointer transition-colors duration-300 ml-auto`}
        onClick={() =>
          toggleSelectAllPayments(payments.map((payment) => payment.id))
        }
      >
        <div
          className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            selectedPayments.length === payments.length ? "translate-x-6" : ""
          }`}
        ></div>
      </div>

      {/* Payments Table */}
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2 px-3">User</th>
            <th className="py-2 px-3">Package</th>
            <th className="py-2 px-3">Due Date</th>
            <th className="py-2 px-3">Paid Date</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const isSelected = selectedPayments.includes(payment.id);

            return (
              <tr
                key={payment.id}
                className={`cursor-pointer ${
                  isSelected ? "bg-gray-700" : ""
                } hover:bg-gray-700 hover:bg-opacity-50`}
                onClick={() => togglePaymentSelection(payment.id)}
              >
                <td className="py-2 px-3 flex items-center gap-2">
                  <FaUser
                    className={`text-lg ${
                      isSelected ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  {getUserNameById(payment.userId)}
                </td>
                <td className="py-2 px-3">
                  {getPackageNameById(payment.packageId)}
                </td>
                <td className="py-2 px-3">{formatDate(payment.dueDate)}</td>
                <td className="py-2 px-3">{formatDate(payment.paidDate)}</td>
                <td className="py-2 px-3">
                  ${payment.discountedAmount.toFixed(2)}
                </td>
                <td
                  className={`py-2 px-3 font-bold ${
                    payment.status.toLowerCase() === "paid"
                      ? "text-green-400"
                      : payment.status.toLowerCase() === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsList;
