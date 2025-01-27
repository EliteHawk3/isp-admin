import { useState, FC, useMemo, KeyboardEvent } from "react";
import {
  FaUsers,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { Payment } from "../../types/payments";

interface NotificationsSidebarProps {
  setSelectedCategory: (category: string) => void;
  search: string;
  setSearch: (query: string) => void;
  activeCategory: string;
  onSearch: (query: string) => void;
  filteredPayments: Payment[]; // Use only filtered data for count calculation
}

const NotificationsSideBar: FC<NotificationsSidebarProps> = ({
  setSelectedCategory,
  search,
  setSearch,
  activeCategory,
  onSearch,
  filteredPayments,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate counts for all categories from filteredPayments
  const categoryCounts = useMemo(() => {
    const allCount = filteredPayments.length;
    const pendingCount = filteredPayments.filter(
      (payment) => payment.status.toLowerCase() === "pending"
    ).length;
    const paidCount = filteredPayments.filter(
      (payment) => payment.status.toLowerCase() === "paid"
    ).length;
    const overdueCount = filteredPayments.filter(
      (payment) => payment.status.toLowerCase() === "overdue"
    ).length;

    return {
      all: allCount,
      pending: pendingCount,
      paid: paidCount,
      overdue: overdueCount,
    };
  }, [filteredPayments]);

  // Define categories
  const categories = useMemo(
    () => [
      {
        label: "All",
        count: categoryCounts.all,
        icon: FaUsers,
        color: "text-blue-500",
      },
      {
        label: "Pending",
        count: categoryCounts.pending,
        icon: FaExclamationCircle,
        color: "text-yellow-400",
      },
      {
        label: "Paid",
        count: categoryCounts.paid,
        icon: FaCheckCircle,
        color: "text-green-500",
      },
      {
        label: "Overdue",
        count: categoryCounts.overdue,
        icon: FaClock,
        color: "text-red-500",
      },
    ],
    [categoryCounts]
  );

  const handleKeyPress = (e: KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      action();
    }
  };

  return (
    <div className="w-full lg:w-1/4 p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl h-auto sm:h-[85vh] flex flex-col">
      {/* Search Bar */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const query = e.target.value;
            setSearch(query);
            onSearch(query);
          }}
          placeholder="Search by user or package..."
          className="w-full pl-10 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Categories Toggle */}
      <h3
        className="text-lg font-semibold mb-4 text-gray-300 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          handleKeyPress(e, () => setIsExpanded((prev) => !prev))
        }
      >
        Categories
        <span className="text-gray-400">{isExpanded ? "▼" : "▶"}</span>
      </h3>

      {/* Categories List */}
      {isExpanded && (
        <ul role="list" className="space-y-4 text-sm overflow-y-auto">
          {categories.map((item) => {
            const categoryKey = item.label.toLowerCase();
            const isActive = activeCategory === categoryKey;

            return (
              <li
                key={item.label}
                onClick={() => setSelectedCategory(categoryKey)}
                className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition ${
                  isActive
                    ? "bg-gray-700 bg-opacity-50 text-white font-bold border-l-4 border-purple-500"
                    : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300"
                }`}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) =>
                  handleKeyPress(e, () => setSelectedCategory(categoryKey))
                }
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`${item.color} text-lg`} />
                  <span>{item.label}</span>
                </div>
                <span className="text-gray-400">{item.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationsSideBar;
