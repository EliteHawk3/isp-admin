import { useState, useMemo, KeyboardEvent, FC } from "react";
import {
  FaUsers,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";

interface PaymentsSidebarProps {
  allCount: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;
  setSelectedCategory: (category: string) => void;
  search: string;
  setSearch: (query: string) => void;
  activeCategory: string;
  onSearch: (query: string) => void; // Trigger search logic in the parent
}

const PaymentsSidebar: FC<PaymentsSidebarProps> = ({
  allCount,
  pendingCount,
  paidCount,
  overdueCount,
  setSelectedCategory,
  search,
  setSearch,
  activeCategory,
  onSearch,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const categories = useMemo(
    () => [
      { label: "All", count: allCount, icon: FaUsers, color: "text-blue-500" },
      {
        label: "Pending",
        count: pendingCount,
        icon: FaExclamationCircle,
        color: "text-teal-400",
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
    ],
    [allCount, pendingCount, paidCount, overdueCount]
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
            setSearch(e.target.value);
            onSearch(e.target.value);
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

export default PaymentsSidebar;
