import { useState, useMemo, KeyboardEvent, FC } from "react";
import {
  FaUsers,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";

interface UsersSidebarSectionProps {
  allCount: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;

  onCategoryChange: (category: string) => void;
  onAddUser: () => void;
  activeCategory: string;
}

const UsersSidebarSection: FC<UsersSidebarSectionProps> = ({
  allCount,
  pendingCount,
  paidCount,
  overdueCount,
  onCategoryChange,
  onAddUser,
  activeCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Memoize categories to avoid unnecessary re-renders.
  // We compare each category's label (e.g. "All", "Pending") in the UI.
  const categories = useMemo(
    () => [
      {
        label: "All",
        count: allCount || 0,
        icon: FaUsers,
        color: "text-blue-500",
      },
      {
        label: "Pending",
        count: pendingCount || 0,
        icon: FaExclamationCircle,
        color: "text-teal-400",
      },
      {
        label: "Paid",
        count: paidCount || 0,
        icon: FaCheckCircle,
        color: "text-green-500",
      },
      {
        label: "Overdue",
        count: overdueCount || 0,
        icon: FaClock,
        color: "text-red-500",
      },
    ],
    [allCount, pendingCount, paidCount, overdueCount]
  );

  // Handle keyboard accessibility (Enter/Space) for clickable elements
  const handleKeyPress = (e: KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      action();
    }
  };

  return (
    <div className="w-full lg:w-1/4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl h-[85vh] flex flex-col">
      {/* Add User Button */}
      <button
        onClick={onAddUser}
        aria-label="Add New User"
        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-purple-500 
          rounded-xl hover:bg-purple-600 hover:scale-105 transition transform shadow-lg mb-6"
      >
        <FaPlus className="mr-2" />
        Add New User
      </button>

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
        <ul role="list" className="space-y-4 text-sm">
          {categories.map((item) => {
            // e.g. "all", "pending", "paid", "overdue"
            const categoryKey = item.label.toLowerCase();
            const isActive = activeCategory === categoryKey;

            return (
              <li
                key={item.label}
                onClick={() => onCategoryChange(categoryKey)}
                className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition 
                  ${
                    isActive
                      ? "bg-gray-700 bg-opacity-50 text-white font-bold border-l-4 border-purple-500 border-r"
                      : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300"
                  }`}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) =>
                  handleKeyPress(e, () => onCategoryChange(categoryKey))
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

export default UsersSidebarSection;
