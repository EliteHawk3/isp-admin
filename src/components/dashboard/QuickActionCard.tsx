// src/components/dashboard/QuickActionCard.tsx
import React from "react";

interface QuickActionCardProps {
  icon: React.ReactNode; // Icon for the action
  title: string; // Action title
  onClick?: () => void; // Optional click handler
  color?: string; // Custom gradient color (default or dynamic theme)
  tooltip?: string; // Optional tooltip text for more context
  isDisabled?: boolean; // Disables the card if set to true
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  onClick,
  color = "from-gray-900 to-gray-800", // Default to darker theme
  tooltip,
  isDisabled = false,
}) => {
  return (
    <div
      onClick={isDisabled ? undefined : onClick} // Disable clicks when disabled
      className={`p-6 rounded-lg shadow-md flex items-center transition-all duration-300 relative
        ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} 
        bg-gradient-to-r ${color} hover:scale-105 hover:rotate-1 
        hover:bg-opacity-70 hover:shadow-2xl hover:border hover:border-indigo-500
        hover:before:absolute hover:before:inset-0 hover:before:bg-gradient-to-r 
        hover:before:from-blue-500 hover:before:to-purple-600 hover:before:blur-lg hover:before:opacity-50`}
      title={tooltip} // Tooltip on hover
    >
      {/* Icon */}
      <div className="p-4 bg-gray-700 rounded-full text-white shadow-md">
        {icon}
      </div>
      {/* Title */}
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      </div>
    </div>
  );
};

export default QuickActionCard;
