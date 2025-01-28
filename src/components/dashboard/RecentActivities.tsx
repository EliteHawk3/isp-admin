// src/components/dashboard/RecentActivities.tsx
import React from "react";
import ChartCard from "./ChartCard";
import {
  HiOutlineCreditCard,
  HiOutlineArchive,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

/// Interface for Recent Activities
interface RecentActivity {
  id: number; // Unique identifier
  activity: string; // Title of the activity
  description: string; // Description or additional info
  time: string; // Time when the activity occurred
  type: "payment" | "update" | "alert"; // Type of activity for categorization
}
// Sample Data for Recent Activities
const activities: RecentActivity[] = [
  {
    id: 1,
    activity: "Payment Received",
    description: "$250 from John Doe",
    time: "2 hours ago",
    type: "payment",
  },
  {
    id: 2,
    activity: "Package Updated",
    description: "Upgraded to Gold Plan",
    time: "1 day ago",
    type: "update",
  },
  {
    id: 3,
    activity: "Invoice Sent",
    description: "Invoice #12345 sent",
    time: "3 days ago",
    type: "alert",
  },
  {
    id: 4,
    activity: "User Added",
    description: "New user registered: Jane Doe",
    time: "5 days ago",
    type: "update",
  },
];

// Recent Activities Component
const RecentActivities: React.FC = () => {
  return (
    <ChartCard
      title="Recent Activities"
      infoTooltip="Tracks recent actions such as payments, updates, and alerts."
    >
      {/* Container for Activities */}
      <div className="space-y-6 overflow-y-auto ">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition duration-300 shadow-md"
          >
            {/* Activity Icon */}
            <div
              className={`p-3 rounded-full ${
                activity.type === "payment"
                  ? "bg-green-500/20 text-green-400"
                  : activity.type === "update"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {activity.type === "payment" ? (
                <HiOutlineCreditCard size={24} />
              ) : activity.type === "update" ? (
                <HiOutlineArchive size={24} />
              ) : (
                <HiOutlineExclamationCircle size={24} />
              )}
            </div>

            {/* Activity Details */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-300">{activity.activity}</h4>
              <p className="text-sm text-gray-400">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default RecentActivities;
