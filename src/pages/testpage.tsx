import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaExclamationCircle,
  FaTrashAlt,
  FaUndo,
  FaUsers,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import dayjs from "dayjs";

// Payment Interface
interface Payment {
  id: string;
  user: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
  dueDate: string;
  paidDate?: string;
}

// Dummy Payments Data
const dummyPayments: Payment[] = [
  {
    id: "p1",
    user: "John Doe",
    amount: 120.5,
    status: "Paid",
    date: "2024-01-05",
    dueDate: "2024-01-01",
    paidDate: "2024-01-05",
  },
  {
    id: "p2",
    user: "Jane Smith",
    amount: 80.0,
    status: "Pending",
    date: "2024-01-10",
    dueDate: "2024-01-15",
  },
  {
    id: "p3",
    user: "Michael Scott",
    amount: 60.0,
    status: "Overdue",
    date: "2023-12-15",
    dueDate: "2023-12-10",
  },
];
const SidebarSection = ({
  allCount,
  pendingCount,
  paidCount,
  overdueCount,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
}: {
  allCount: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  search: string;
  setSearch: (query: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-1/4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl h-[85vh] flex flex-col">
      {/* Search Bar */}
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center p-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-md"
          >
            <AiOutlineSearch className="text-white text-lg" />
          </motion.div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments..."
            className="ml-3 bg-transparent w-full text-white placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <h3
        className="text-lg font-semibold mb-4 text-gray-300 cursor-pointer flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Categories{" "}
        <span className="ml-2 text-sm">
          {isExpanded ? (
            <FaChevronDown className="text-gray-400" />
          ) : (
            <FaChevronRight className="text-gray-400" />
          )}
        </span>
      </h3>

      {isExpanded && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 text-sm"
        >
          {[
            {
              label: "All",
              count: allCount,
              icon: FaUsers,
              color: "text-blue-500",
            },
            {
              label: "Pending",
              count: pendingCount,
              icon: FaExclamationCircle,
              color: "text-yellow-500",
            },
            {
              label: "Paid",
              count: paidCount,
              icon: FaCheckCircle,
              color: "text-green-500",
            },
            {
              label: "Overdue",
              count: overdueCount,
              icon: FaClock,
              color: "text-red-500",
            },
          ].map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedCategory(item.label)}
              className={`border-b border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 p-3 rounded-lg transition-all duration-300 shadow-sm ${
                selectedCategory === item.label
                  ? "bg-gray-700 bg-opacity-50"
                  : ""
              }`}
            >
              <item.icon className={`${item.color} text-lg`} />
              <span
                className={`${
                  selectedCategory === item.label
                    ? "text-white font-semibold"
                    : "text-gray-300"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`ml-auto text-sm ${
                  selectedCategory === item.label
                    ? "text-white font-semibold"
                    : "text-gray-400"
                }`}
              >
                {item.count}
              </span>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

// Payments Page Component
const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>(dummyPayments);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const formatDate = (date: string | undefined) =>
    date ? dayjs(date).format("MMM DD, YYYY") : "N/A";

  const handleMarkAsPaid = (id: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
          ? { ...payment, status: "Paid", paidDate: new Date().toISOString() }
          : payment
      )
    );
  };

  const handleMarkAsUnpaid = (id: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
          ? { ...payment, status: "Pending", paidDate: undefined }
          : payment
      )
    );
  };

  const handleDeletePayment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    }
  };

  const {
    totalReceived,
    totalPaidUsers,
    totalPendingAmount,
    totalPendingUsers,
    totalOverdueAmount,
    totalOverdueUsers,
    filteredPayments,
  } = useMemo(() => {
    const filtered =
      selectedCategory === "All"
        ? payments
        : payments.filter((p) => p.status === selectedCategory);

    return {
      totalReceived: payments
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0),
      totalPaidUsers: payments.filter((p) => p.status === "Paid").length,
      totalPendingAmount: payments
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.amount, 0),
      totalPendingUsers: payments.filter((p) => p.status === "Pending").length,
      totalOverdueAmount: payments
        .filter((p) => p.status === "Overdue")
        .reduce((sum, p) => sum + p.amount, 0),
      totalOverdueUsers: payments.filter((p) => p.status === "Overdue").length,
      filteredPayments: filtered.filter(
        (p) =>
          p.user.toLowerCase().includes(search.toLowerCase()) ||
          p.amount.toString().includes(search)
      ),
    };
  }, [payments, selectedCategory, search]);

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-wide">Payments</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => alert("Report download coming soon!")}
          className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
          Download Payments
        </motion.button>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex">
        <SidebarSection
          allCount={payments.length}
          pendingCount={totalPendingUsers}
          paidCount={totalPaidUsers}
          overdueCount={totalOverdueUsers}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
        />

        {/* Main Content */}
        <div className="w-3/4 p-6 flex flex-col">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-4 border-b border-gray-700">
            {/* Total Payments Received */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-600 via-teal-700 to-teal-500 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center transition-transform"
            >
              <h2 className="text-lg font-bold text-white">
                Total Payments Received
              </h2>
              <p className="text-4xl font-bold text-white mt-2">
                ${totalReceived.toFixed(2)}
              </p>
              <p className="text-sm text-gray-200 mt-1">
                Users Paid: <span className="font-bold">{totalPaidUsers}</span>
              </p>
            </motion.div>

            {/* Pending Payments */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-500 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center transition-transform"
            >
              <h2 className="text-lg font-bold text-white">Pending Payments</h2>
              <p className="text-4xl font-bold text-white mt-2">
                ${totalPendingAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-200 mt-1">
                Users: <span className="font-bold">{totalPendingUsers}</span>
              </p>
            </motion.div>

            {/* Overdue Payments */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-500 via-orange-700 to-orange-900 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center transition-transform"
            >
              <h2 className="text-lg font-bold text-white">Overdue Payments</h2>
              <p className="text-4xl font-bold text-white mt-2">
                ${totalOverdueAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-200 mt-1">
                Users: <span className="font-bold">{totalOverdueUsers}</span>
              </p>
            </motion.div>
          </div>

          {/* Payments List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform flex justify-between items-center"
              >
                {/* Payment Details */}
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {payment.user}
                  </h3>
                  <p className="text-sm text-gray-400">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Due Date: {formatDate(payment.dueDate)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Paid Date:{" "}
                    {payment.paidDate ? formatDate(payment.paidDate) : "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {payment.status === "Paid" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to mark this payment as unpaid?"
                          )
                        ) {
                          handleMarkAsUnpaid(payment.id);
                        }
                      }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                    >
                      <FaUndo className="text-white" /> Mark as Unpaid
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleMarkAsPaid(payment.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                    >
                      <FaCheck className="text-white" /> Mark as Paid
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDeletePayment(payment.id)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                  >
                    <FaTrashAlt className="text-white" /> Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
