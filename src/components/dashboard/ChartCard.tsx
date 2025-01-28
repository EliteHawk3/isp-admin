// src/components/dashboard/ChartCard.tsx
import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  infoTooltip?: string;
  borderColor?: string;
  height?: number;
  gradientColors?: string[]; // Array of colors for gradient
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  infoTooltip,
  height,
  borderColor = "border-transparent",
  gradientColors = ["#1E293B", "#0F172A"], // Default dark gradient
}) => {
  const gradient = `linear-gradient(to bottom right, ${gradientColors.join(
    ", "
  )})`;

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-shadow duration-300 border ${borderColor} relative overflow-hidden`} // Added relative for animation positioning
      style={{ height: height ? `${height}px` : "auto", background: gradient }} // Applied gradient
    >
      {/* Animated Glow Border */}
      <div className="absolute inset-0 rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500 " />
      </div>

      <div className="relative z-10">
        {" "}
        {/* Added z-index to bring content forward */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100 underline decoration-blue-500">
            {" "}
            {/* Lighter text for dark background */}
            {title}
          </h3>

          {/* Tooltip Icon */}
          {infoTooltip && (
            <div
              className="ml-2 text-gray-400 cursor-pointer hover:text-gray-200"
              title={infoTooltip}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20.72a8.72 8.72 0 100-17.44 8.72 8.72 0 000 17.44z"
                />
              </svg>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
