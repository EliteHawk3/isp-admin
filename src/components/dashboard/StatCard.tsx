import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  label: string;
  subValue?: string | number;
  color?: string; // Primary color
  subColor?: string; // Secondary color
  progress?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  label,
  subValue,
  color = "#4F46E5",
  subColor = "#8B5CF6",
  progress = 100,
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden ${className}`}
      style={{ transition: "transform 0.3s ease-in-out, box-shadow 0.3s" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent opacity-0 transition-opacity hover:opacity-50 pointer-events-none"></div>
      {/* Top Row: Icon, Title, Value, Progress */}
      <div className="flex items-center justify-between">
        {/* Icon, Title, Value */}
        <div className="flex items-center">
          <div
            className="p-4 rounded-full text-white shadow-md"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-3xl font-semibold text-white">{value}</p>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          </div>
        </div>
        {/* Progress Bar with Label/SubText */}
        <div className="flex flex-col items-center">
          {/* Progress Circle */}
          <div className="relative w-12 h-12">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-gray-700 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="stroke-current"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={(251.2 * (100 - progress)) / 100}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                style={{ stroke: subColor }}
              />
            </svg>
          </div>
          {/* SubValue and Label */}
          <div className="mt-2 text-center">
            {subValue && (
              <p className="text-sm font-bold" style={{ color: subColor }}>
                {subValue}
              </p>
            )}
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
