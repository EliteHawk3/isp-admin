import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { Payment } from "../../types/payments";

interface PaymentsHeaderProps {
  totalPaymentsCount: number; // Total number of payments
  payments: Payment[]; // Array of payments
}

const PaymentsHeader = ({
  totalPaymentsCount,
  payments,
}: PaymentsHeaderProps) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      payments.map((payment) => ({
        ID: payment.id,
        User: payment.userId, // Replace with user name if available
        Amount: `$${payment.discountedAmount.toFixed(2)}`,
        Status: payment.status,
        Date: payment.date,
        DueDate: payment.dueDate,
        PaidDate: payment.paidDate || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments.xlsx");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      {/* Title with Total Count */}
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
          Payments
        </h1>
        <p className="text-sm text-gray-400">
          {totalPaymentsCount} total payments
        </p>
      </div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={handleDownload}
        className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-3 rounded-lg shadow-md"
      >
        Download Payments
      </motion.button>
    </div>
  );
};

export default PaymentsHeader;
