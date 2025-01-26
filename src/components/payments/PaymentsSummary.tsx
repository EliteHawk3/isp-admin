import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaChartBar, FaExclamationCircle, FaUserCheck } from "react-icons/fa";
import { useUsers } from "../../context/UsersContext";

interface PaymentsSummaryProps {
  onRevenueClick: () => void;
}

const PaymentsSummary = ({ onRevenueClick }: PaymentsSummaryProps) => {
  const { users } = useUsers();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Main engagement: Users with Paid payments from the current month
  const currentMonthPaidUsers = useMemo(() => {
    return users.filter((user) =>
      user.payments.some(
        (payment) =>
          payment.status === "Paid" &&
          new Date(payment.paidDate || "").getMonth() === currentMonth &&
          new Date(payment.paidDate || "").getFullYear() === currentYear
      )
    );
  }, [users, currentMonth, currentYear]);

  const previousMonthPaidInCurrentMonth = useMemo(() => {
    return users.filter((user) =>
      user.payments.some(
        (payment) =>
          payment.status === "Paid" &&
          new Date(payment.date).getMonth() < currentMonth &&
          new Date(payment.date).getFullYear() <= currentYear &&
          new Date(payment.paidDate || "").getMonth() === currentMonth &&
          new Date(payment.paidDate || "").getFullYear() === currentYear
      )
    );
  }, [users, currentMonth, currentYear]);

  // Calculate engagement percentage
  const userEngagement = useMemo(() => {
    const totalUsers = users.length;
    const engagedUsers = currentMonthPaidUsers.length;
    return totalUsers > 0 ? (engagedUsers / totalUsers) * 100 : 0;
  }, [users, currentMonthPaidUsers]);

  // Total revenue for the current month
  const totalRevenue = useMemo(() => {
    return users
      .flatMap((user) => user.payments)
      .filter(
        (payment) =>
          payment.status === "Paid" &&
          new Date(payment.paidDate || "").getMonth() === currentMonth &&
          new Date(payment.paidDate || "").getFullYear() === currentYear
      )
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users, currentMonth, currentYear]);

  // Outstanding payments: Pending + Overdue (all months)
  const outstandingPayments = useMemo(() => {
    return users
      .flatMap((user) => user.payments)
      .filter((payment) => ["Pending", "Overdue"].includes(payment.status))
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users]);

  // Total users with outstanding payments
  const outstandingUsers = useMemo(() => {
    return users.filter((user) =>
      user.payments.some((payment) =>
        ["Pending", "Overdue"].includes(payment.status)
      )
    ).length;
  }, [users]);

  const engagedUsers = currentMonthPaidUsers.length;
  const previousPaidCount = previousMonthPaidInCurrentMonth.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 pb-4 border-b border-gray-700">
      {/* Total Revenue Section */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-gradient-to-br from-green-600 via-teal-700 to-teal-500 p-6 rounded-xl shadow-lg flex flex-col items-center cursor-pointer"
        onClick={onRevenueClick}
      >
        <div className="flex items-center gap-3 ">
          <FaChartBar className="text-5xl text-white animate-professionalIcon" />
          <h2 className="text-lg sm:text-xl font-bold text-white text-center">
            Total Revenue
          </h2>
        </div>
        <p className="text-xl sm:text-3xl font-bold text-white mt-3">
          ${totalRevenue.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base text-gray-200 mt-2">
          Users Paid: <span className="font-bold">{engagedUsers}</span>
        </p>
      </motion.div>

      {/* Outstanding Payments Section */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-500 p-6 rounded-xl shadow-lg flex flex-col items-center"
      >
        <div className="flex items-center gap-3">
          <FaExclamationCircle className="text-5xl text-white" />
          <h2 className="text-lg sm:text-xl font-bold text-white text-center">
            Outstanding Payments
          </h2>
        </div>
        <p className="text-xl sm:text-3xl font-bold text-white mt-3">
          ${outstandingPayments.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base text-gray-200 mt-2">
          Affected Users: <span className="font-bold">{outstandingUsers}</span>
        </p>
      </motion.div>

      {/* User Engagement Section */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-gradient-to-br from-orange-500 via-orange-700 to-orange-900 p-6 rounded-xl shadow-lg flex flex-col items-center"
      >
        <div className="flex items-center gap-3">
          <FaUserCheck className="text-5xl text-white" />
          <h2 className="text-lg sm:text-xl font-bold text-white text-center">
            User Engagement
          </h2>
        </div>

        {/* Main Engagement Metric */}
        <p className="text-xl sm:text-3xl font-bold text-white mt-3">
          {userEngagement.toFixed(2)}%
        </p>
        <p className="text-sm sm:text-base text-gray-200 mt-2">
          Engaged Users (Current Month):{" "}
          <span className="font-bold">{engagedUsers}</span>
        </p>

        {/* Additional Metric for Previous Month's Payments */}
        {previousPaidCount > 0 ? (
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            +{previousPaidCount} users paid previous months' Pending/Overdue
            payments this month.
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            No previous month payments resolved this month.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentsSummary;
