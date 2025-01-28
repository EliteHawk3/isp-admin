/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineArchive,
  HiOutlinePlusCircle,
  HiOutlineExclamationCircle,

  //HiOutlineClipboardList,
  // HiOutlineCalendar,
} from "react-icons/hi";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageTopBar from "../components/layout/PageTopBar";
import CityMap from "../components/layout/CityMap";
import CalendarView from "../components/layout/CalendarView";
// Dummy Data
const lineChartData = [
  { month: "Jan", revenue: 1200, users: 50 },
  { month: "Feb", revenue: 2100, users: 70 },
  { month: "Mar", revenue: 3200, users: 90 },
  { month: "Apr", revenue: 2800, users: 80 },
  { month: "May", revenue: 3400, users: 100 },
  { month: "Jun", revenue: 4000, users: 110 },
  { month: "Jul", revenue: 4600, users: 120 },
  { month: "Aug", revenue: 5200, users: 130 },
];
const pendingPaymentsData = [
  { month: "Jan", pending: 40 },
  { month: "Feb", pending: 50 },
  { month: "Mar", pending: 30 },
  { month: "Apr", pending: 20 },
  { month: "May", pending: 60 },
];
const pieChartData = [
  { name: "Paid", value: 65 },
  { name: "Pending", value: 35 },
];

const COLORS = ["#34D399", "#EF4444"];

// Task Interface
interface Task {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Completed"; // Enforced statuses
  priority: "High" | "Medium" | "Low"; // Added priorities
  deadline?: string; // Optional deadline field
}

/// Interface for Recent Activities
interface RecentActivity {
  id: number; // Unique identifier
  activity: string; // Title of the activity
  description: string; // Description or additional info
  time: string; // Time when the activity occurred
  type: "payment" | "update" | "alert"; // Type of activity for categorization
}

// Monthly Payments Interface
interface PaymentData {
  month: string; // Month Name (e.g., "Jan")
  cost: number; // Monthly cost
  payments: number; // Monthly payments received
  profit: number; // Monthly profit
  currency?: string; // Optional currency type (e.g., "USD")
  total?: number; // Optional cumulative total
}

// COMPONENT PROPS INTERFACES
interface StatCardProps {
  icon: React.ReactNode; // Icon for the stat
  title: string; // Title of the stat
  value: string | number; // Primary value to display
  label: string; // Label for the secondary value
  subValue?: string | number; // Optional secondary value
  color?: string; // Primary color
  subColor?: string; // Secondary color
  progress?: number; // Progress percentage
  className?: string; // Optional additional styles
}

interface QuickActionCardProps {
  icon: React.ReactNode; // Icon for the action
  title: string; // Action title
  onClick?: () => void; // Optional click handler
  color?: string; // Custom gradient color (default or dynamic theme)
  tooltip?: string; // Optional tooltip text for more context
  isDisabled?: boolean; // Disables the card if set to true
}

interface ChartCardProps {
  title: string; // Chart title
  children: React.ReactNode; // Chart content
  infoTooltip?: string; // Optional tooltip description
  borderColor?: string; // Dynamic border colors for themes
  height?: number; // Dynamic height for different chart types
  backgroundColor?: string; // Custom background colors (e.g., gradients)
}

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
}
const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  label,
  subValue,
  color = "#4F46E5", // Default primary color
  subColor = "#8B5CF6", // Default secondary color
  progress = 100, // Default progress
  className = "", // Allow external styles like animations
}) => {
  return (
    <div
      className={`bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center 
        transition-all duration-300 ${className}`}
    >
      {/* Left Section: Icon and Primary Stats */}
      <div className="flex items-center">
        <div className="p-4 bg-gray-700 rounded-full text-white shadow-md">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-white">{value}</p>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        </div>
      </div>

      {/* Right Section: Progress and Labels */}
      <div className="flex flex-col items-center">
        {/* Circular Progress Bar */}
        <div className="relative w-10 h-10">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              className="text-gray-700 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <circle
              className="stroke-current"
              strokeWidth="10"
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
        {/* Secondary Stats */}
        {subValue && (
          <p className="text-sm font-bold mt-2" style={{ color: subColor }}>
            {subValue}
          </p>
        )}
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
};

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

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  infoTooltip,
  borderColor = "border-transparent", // Default border color
}) => {
  return (
    <div
      className={`bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300 underline decoration-blue-400">
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
  );
};
// Fixing Bar Shape - Explicitly Typing Props
const CustomBarShape: React.FC<React.SVGProps<SVGRectElement>> = (props) => {
  return (
    <rect
      {...props} // Spread all valid SVG properties
      className="transition-transform duration-200 origin-bottom hover:scale-y-105"
    />
  );
};

const RecentTransactions: React.FC = () => {
  // Sample Data
  const transactions: Transaction[] = [
    { id: "01e4dsa", name: "johndoe", date: "2021-09-01", amount: "$43.95" },
    {
      id: "0315dsaa",
      name: "jackdower",
      date: "2022-04-01",
      amount: "$133.45",
    },
    {
      id: "01e4dsa",
      name: "aberdjohnny",
      date: "2021-09-01",
      amount: "$43.95",
    },
    { id: "51034szv", name: "usmanali", date: "2023-11-05", amount: "$200.95" },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center p-4 rounded-lg bg-gray-900 hover:bg-gray-700 transition duration-300"
          >
            {/* Transaction ID and Name */}
            <div className="flex-1">
              <p className="text-blue-400 font-semibold">{transaction.id}</p>
              <p className="text-gray-400 text-sm">{transaction.name}</p>
            </div>

            {/* Date - Fixed Width */}
            <div className="w-28 text-gray-400 text-sm text-center">
              {transaction.date}
            </div>

            {/* Amount - Fixed Width */}
            <div className="w-24 text-right">
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                {transaction.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample Tasks Data
const tasks: Task[] = [
  {
    id: 1,
    title: "Monthly Cost Analysis",
    status: "Completed",
    priority: "High",
    deadline: "2024-01-15",
  },
  {
    id: 2,
    title: "Review Profit Reports",
    status: "Pending",
    priority: "Medium",
    deadline: "2024-01-20",
  },
  {
    id: 3,
    title: "User Payment Updates",
    status: "In Progress",
    priority: "Low",
    deadline: "2024-02-01",
  },
];

// Tasks Component
const Tasks: React.FC = () => {
  return (
    <ChartCard
      title="Tasks"
      infoTooltip="Track the progress of ongoing and completed tasks."
    >
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition duration-300 shadow-md"
          >
            {/* Task Header */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-300 font-medium">{task.title}</h4>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  task.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : task.status === "Completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  task.status === "Completed"
                    ? "bg-green-400"
                    : task.status === "In Progress"
                    ? "bg-blue-400"
                    : "bg-yellow-400"
                }`}
                style={{
                  width:
                    task.status === "Completed"
                      ? "100%"
                      : task.status === "In Progress"
                      ? "50%"
                      : "25%",
                }}
              ></div>
            </div>

            {/* Task Footer - Deadline and Priority */}
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Due: {task.deadline || "N/A"}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  task.priority === "High"
                    ? "bg-red-500/20 text-red-400"
                    : task.priority === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {task.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

// Sample Recent Activities Data
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
      <div className="space-y-6 overflow-y-auto max-h-96">
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

// Sample Monthly Payments Data
const paymentData: PaymentData[] = [
  { month: "Jan", cost: 300, payments: 520, profit: 220 },
  { month: "Feb", cost: 280, payments: 480, profit: 200 },
  { month: "Mar", cost: 310, payments: 500, profit: 190 },
  { month: "Apr", cost: 270, payments: 490, profit: 220 },
  { month: "May", cost: 350, payments: 580, profit: 230 },
];

// Monthly Payments Component
const MonthlyPayments: React.FC = () => {
  return (
    <ChartCard
      title="Monthly Costs, Payments & Profit"
      infoTooltip="Visualizes monthly financial trends."
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={paymentData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="#F59E0B" name="Cost" />
          <Bar dataKey="payments" fill="#10B981" name="Payments" />
          <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="p-8 space-y-6 h-full w-full pb-96">
      <PageTopBar />
      <h1 className="text-2xl font-semibold text-gray-300 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<HiOutlineUser size={28} className="text-blue-400" />}
          title="Users Paid"
          value="32,441"
          subValue="1,240"
          label="New Users"
          color="#4F46E5"
          subColor="#10B981"
          progress={75}
          className="transform transition-transform hover:scale-105 hover:shadow-2xl duration-200"
        />
        <StatCard
          icon={<HiOutlineCreditCard size={28} className="text-green-400" />}
          title="Payments"
          value="$12,450"
          subValue="$540"
          label="Pending Payments"
          color="#10B981"
          subColor="#10B981"
          progress={90}
          className="transform transition-transform hover:scale-105 hover:shadow-2xl duration-200"
        />
        <StatCard
          icon={<HiOutlineArchive size={28} className="text-purple-400" />}
          title="Packages"
          value="45"
          subValue="12"
          label="New Packages"
          color="#8B5CF6"
          subColor="#10B981"
          progress={45}
          className="transform transition-transform hover:scale-105 hover:shadow-2xl duration-200"
        />
        <StatCard
          icon={<HiOutlinePlusCircle size={28} className="text-yellow-400" />}
          title="Pending Approvals"
          value="330"
          subValue="15"
          label="Approvals"
          color="#F59E0B"
          subColor="#10B981"
          progress={30}
          className="transform transition-transform hover:scale-105 hover:shadow-2xl duration-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-blue-400" />}
          title="Add User"
          onClick={() => console.log("Add User Clicked!")}
          color="from-gray-900 to-gray-800"
          tooltip="Add a new user to the system"
        />
        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-purple-400" />}
          title="Add Package"
          onClick={() => console.log("Add Package Clicked!")}
          color="from-gray-900 to-gray-800"
          tooltip="Create a new package plan"
        />
        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-green-400" />}
          title="Send Notification"
          onClick={() => console.log("Send Notification Clicked!")}
          color="from-gray-900 to-gray-800"
          tooltip="Send notifications to users"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* First Row */}
        {/* Revenue & User Growth - Larger Width */}
        <div className="col-span-2">
          <ChartCard
            title="Revenue & User Growth"
            infoTooltip="Shows revenue and user growth trends over time."
            borderColor="hover:border-blue-400"
          >
            <div style={{ height: "350px" }}>
              {" "}
              {/* Set height explicitly */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#06B6D4" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "8px",
                    }}
                  />
                  {/* Revenue Line */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                  {/* Users Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent Transactions - Smaller Width */}
        <div className="col-span-1">
          <ChartCard
            title="Recent Transactions"
            infoTooltip="List of recent transactions and amounts."
            borderColor="hover:border-green-400"
          >
            <div style={{ height: "350px", overflowY: "auto" }}>
              {" "}
              {/* Consistent height */}
              <RecentTransactions />
            </div>
          </ChartCard>
        </div>

        {/* Second Row */}
        {/* Paid and Pending Users - Smaller Width */}
        <div className="col-span-1">
          <ChartCard
            title="Paid and Pending Users"
            infoTooltip="Percentage split between Paid and Pending users."
            borderColor="hover:border-purple-400"
          >
            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* City Map - Larger Width */}
        <div className="col-span-2">
          <ChartCard
            title="Geography Based Traffic"
            infoTooltip="Displays user distribution based on location."
            borderColor="hover:border-yellow-400"
          >
            <CityMap height={350} />
          </ChartCard>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Tasks Section */}
        <ChartCard
          title="Tasks"
          infoTooltip="Track the progress of ongoing and completed tasks with priorities and deadlines."
        >
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition duration-300 shadow-md"
              >
                {/* Task Title and Status */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-300 font-medium">{task.title}</h4>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      task.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : task.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      task.status === "Completed"
                        ? "bg-green-400"
                        : task.status === "In Progress"
                        ? "bg-blue-400"
                        : "bg-yellow-400"
                    }`}
                    style={{
                      width:
                        task.status === "Completed"
                          ? "100%"
                          : task.status === "In Progress"
                          ? "50%"
                          : "25%",
                    }}
                  ></div>
                </div>

                {/* Task Footer - Deadline and Priority */}
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Due: {task.deadline || "N/A"}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      task.priority === "High"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Monthly Costs, Payments & Profits */}
        <ChartCard
          title="Monthly Costs, Payments & Profits"
          infoTooltip="Track financial metrics including costs, payments, and profit."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData} barGap={8} barCategoryGap={20}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip cursor={false} />

              {/* Bars with Custom Shape */}
              <Bar
                dataKey="cost"
                fill="#F59E0B"
                name="Cost"
                barSize={40}
                shape={<CustomBarShape />}
              />
              <Bar
                dataKey="payments"
                fill="#10B981"
                name="Payments"
                barSize={40}
                shape={<CustomBarShape />}
              />
              <Bar
                dataKey="profit"
                fill="#3B82F6"
                name="Profit"
                barSize={40}
                shape={<CustomBarShape />}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        {/* Recent Activities Section */}
        <ChartCard
          title="Recent Activities"
          infoTooltip="Tracks recent actions such as payments, updates, and user activities."
        >
          <div className="space-y-6 overflow-y-auto max-h-96">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition duration-300 shadow-md"
              >
                {/* Icon based on activity type */}
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
                  <h4 className="font-medium text-gray-300">
                    {activity.activity}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Calendar Events Section */}
        <ChartCard
          title="Calendar Events"
          infoTooltip="Upcoming deadlines, payments, and alerts."
        >
          <CalendarView />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
