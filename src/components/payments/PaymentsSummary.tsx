import { motion } from "framer-motion";

interface PaymentsSummaryProps {
  totalRevenue: number;
  totalPaidUsers: number;
  outstandingPayments: number;
  outstandingUsers: number;
  userEngagement: number;
}

const PaymentsSummary = ({
  totalRevenue,
  totalPaidUsers,
  outstandingPayments,
  outstandingUsers,
  userEngagement,
}: PaymentsSummaryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 pb-4 border-b border-gray-700">
      {/* Total Revenue Collected */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-green-600 via-teal-700 to-teal-500 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col items-center"
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          Total Revenue Collected
        </h2>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
          ${totalRevenue.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-1">
          Users Paid: <span className="font-bold">{totalPaidUsers}</span>
        </p>
      </motion.div>

      {/* Outstanding Payments */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-500 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col items-center"
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          Outstanding Payments
        </h2>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
          ${outstandingPayments.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-1">
          Affected Users: <span className="font-bold">{outstandingUsers}</span>
        </p>
      </motion.div>

      {/* User Engagement */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-orange-500 via-orange-700 to-orange-900 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col items-center"
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          User Engagement
        </h2>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
          {userEngagement.toFixed(2)}%
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-1">
          Total Users:{" "}
          <span className="font-bold">{totalPaidUsers + outstandingUsers}</span>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentsSummary;
