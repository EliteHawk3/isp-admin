import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTimesCircle,
  FaFileExcel,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useUsers } from "../../context/UsersContext";
import { usePackages } from "../../context/PackagesContext";

interface PaymentHistoryProps {
  selectedUserId: string; // ID of the selected user
  onClose: () => void; // Close the history modal
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  selectedUserId,
  onClose,
}) => {
  const { users } = useUsers(); // Access UsersContext
  const { packages } = usePackages(); // Access PackagesContext

  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Find the selected user
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [users, selectedUserId]
  );

  // Filter payments for the selected user
  const filteredPayments = useMemo(() => {
    if (!selectedUser) return [];
    return selectedUser.payments.filter((payment) => {
      if (filter === "all") return true;
      return payment.status === filter;
    });
  }, [selectedUser, filter]);

  // Sort payments
  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      if (sortBy === "amount") return b.discountedAmount - a.discountedAmount;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredPayments, sortBy]);

  // Paginate payments
  const paginatedPayments = useMemo(() => {
    return sortedPayments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedPayments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);

  // Get package details by ID
  const getPackageDetailsById = (packageId: string) =>
    packages.find((pkg) => pkg.id === packageId) || {
      name: "Unknown",
      cost: 0,
    };

  // Format date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Export to Excel
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPayments.map((payment) => ({
        ID: payment.id,
        Package: getPackageDetailsById(payment.packageId).name,
        Amount: `$${payment.discountedAmount.toFixed(2)}`,
        Status: payment.status,
        Date: formatDate(payment.date),
        DueDate: formatDate(payment.dueDate),
        PaidDate: payment.paidDate ? formatDate(payment.paidDate) : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment History");
    XLSX.writeFile(workbook, `${selectedUser?.name || "User"}_History.xlsx`);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[600px]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Payment History: {selectedUser?.name || "Unknown User"}
          </h2>
          <button
            onClick={onClose}
            className="bg-red-600 px-3 py-2 rounded-full shadow-lg hover:bg-red-700"
          >
            <FaTimesCircle className="text-white text-lg" />
          </button>
        </div>

        {/* Filter and Sort */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            {["all", "Paid", "Pending", "Overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  filter === status ? "bg-blue-600 text-white" : "bg-gray-700"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Payments List */}
        <div className="overflow-y-auto max-h-96">
          {paginatedPayments.map((payment) => {
            const packageDetails = getPackageDetailsById(payment.packageId);

            return (
              <div
                key={payment.id}
                className="p-4 bg-gray-800 rounded-lg mb-4 border-l-4 flex items-center justify-between"
                style={{
                  borderColor:
                    payment.status === "Paid"
                      ? "green"
                      : payment.status === "Pending"
                      ? "yellow"
                      : "red",
                }}
              >
                <div>
                  <p className="text-sm">
                    <strong>Package:</strong> {packageDetails.name} ($
                    {packageDetails.cost.toFixed(2)})
                  </p>
                  <p className="text-sm">
                    <strong>Amount:</strong> $
                    {payment.discountedAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Due Date:</strong> {formatDate(payment.dueDate)}
                  </p>
                  {payment.paidDate && (
                    <p className="text-sm">
                      <strong>Paid Date:</strong> {formatDate(payment.paidDate)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination and Export */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 disabled:opacity-50"
            >
              <FaArrowLeft />
            </button>
            <span className="text-gray-300">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 disabled:opacity-50"
            >
              <FaArrowRight />
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-2 rounded-lg shadow-lg hover:from-green-700 hover:to-teal-700"
          >
            <FaFileExcel className="inline mr-2" /> Download History
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentHistory;
