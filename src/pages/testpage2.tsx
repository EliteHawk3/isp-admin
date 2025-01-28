import React from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C9A7", "#4cc9f0", "#00FFFF"];

// Fixing Bar Shape - Explicitly Typing Props

// Tasks Component

// Sample Recent Activities Data
import UsersForm from "../components/users/UsersForm";

import StatCard from "../components/dashboard/StatCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import ChartCard from "../components/dashboard/ChartCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import CityMap from "../components/dashboard/CityMap";
import { useUsers } from "../context/UsersContext";
import { usePackages } from "../context/PackagesContext";
// import { useNotifications } from "../context/NotificationsContext";
import { FaUsers, FaClock, FaBoxOpen, FaWallet } from "react-icons/fa";
// import { useTasks } from "../context/TasksContext";
import { useMemo, useState, useEffect } from "react";
import { User } from "../types/users"; // Import your types
// import { Payment } from "../types/payments";
import { motion } from "framer-motion";
import PackageForm from "../components/packages/PackageForm";
// import { Skeleton } from "@mantine/core";
import { Package } from "../types/packages";
import TaskCreationModal from "../components/dashboard/TaskCreationModal";
import TasksList from "../components/dashboard/TasksList";
import CalendarView from "../components/dashboard/CalendarView";
type Granularity = "year" | "month" | "week" | "day";

// Dashboard Component
const Dashboard: React.FC = () => {
  // Fetching data from contexts
  const { users, addUser, editUser } = useUsers();
  const { packages, setPackages } = usePackages();
  // const { notifications } = useNotifications();
  // const { tasks } = useTasks();
  // Form visibility state
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAddUserSuccessRibbon, setAddUserShowSuccessRibbon] =
    useState(false);
  const [showAddPackageSuccessRibbon, setAddPackageShowSuccessRibbon] =
    useState(false);
  const [showAddTaskSuccessRibbon, setAddTaskShowSuccessRibbon] =
    useState(false);
  // Auto-hide success ribbon after animation
  // src/pages/Dashboard.tsx
  useEffect(() => {
    if (showAddTaskSuccessRibbon) {
      // Remove any parentheses here if present
      const timer = setTimeout(() => {
        setAddTaskShowSuccessRibbon(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showAddTaskSuccessRibbon]);
  // Form submission handler
  const handleSubmit = (userData: User) => {
    if (selectedUser) {
      editUser(userData);
    } else {
      addUser(userData);
    }
    setAddFormVisible(false);
    setSelectedUser(null);
    setAddUserShowSuccessRibbon(true);

    // Automatically hide the success ribbon after 4 seconds
    setTimeout(() => {
      setAddUserShowSuccessRibbon(false);
    }, 8000);
  };
  const handleAddPackage = (newPackage: Package) => {
    setPackages((prev) => [{ ...newPackage, users: 0 }, ...prev]);
    setShowPackageForm(false);
    setAddPackageShowSuccessRibbon(true);

    setTimeout(() => {
      setAddPackageShowSuccessRibbon(false);
    }, 8000);
  };

  // const totalNotifications = notifications.length;
  // const completedTasks = tasks.filter(
  //   (task) => task.status === "Completed"
  // ).length;
  // const totalTasks = tasks.length;
  // const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  // Helper functions
  const getCurrentMonth = () => new Date().getMonth();
  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    return (paymentDate: Date) => paymentDate >= startOfWeek;
  };
  // Helper function to get the current month and year

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  // Total number of packages
  const totalPackages = packages.length;
  // Packages sold this month (users added this month)
  const packagesSoldThisMonth = useMemo(() => {
    return users.filter((user) => {
      const userCreatedDate = new Date(user.createdAt || ""); // Assuming `createdAt` field exists
      return (
        userCreatedDate.getMonth() === currentMonth &&
        userCreatedDate.getFullYear() === currentYear
      );
    }).length;
  }, [users, currentMonth, currentYear]);

  // User Stats
  const totalUsers = users.length;
  const usersThisMonth = users.filter(
    (user) => new Date(user.createdAt).getMonth() === getCurrentMonth()
  ).length;

  // Create pieChartData
  const pieChartData = useMemo(() => {
    const statusCounts = {
      Paid: 0,
      Pending: 0,
      Overdue: 0,
    };

    users.forEach((user) => {
      user.payments.forEach((payment) => {
        const paymentDate = new Date(payment.date);
        if (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        ) {
          statusCounts[payment.status] += 1;
        }
      });
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [users, currentMonth, currentYear]);
  // Payments Stats
  const payments = users.flatMap((user) => user.payments);

  // Current Month Payments (Paid)
  const paymentsThisMonth = payments.filter(
    (payment) =>
      payment.status === "Paid" &&
      new Date(payment.paidDate || "").getMonth() === getCurrentMonth()
  );
  const totalPaymentsThisMonth = paymentsThisMonth.reduce(
    (sum, p) => sum + p.discountedAmount,
    0
  );

  // Current Week Payments (Paid)
  const paymentsThisWeek = paymentsThisMonth.filter((payment) =>
    getCurrentWeek()(new Date(payment.paidDate || ""))
  );
  const totalPaymentsThisWeek = paymentsThisWeek.reduce(
    (sum, p) => sum + p.discountedAmount,
    0
  );

  // Outstanding payments: Pending + Overdue (all months)
  const outstandingPayments = useMemo(() => {
    return users
      .flatMap((user) => user.payments)
      .filter((payment) => ["Pending", "Overdue"].includes(payment.status))
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users]);

  const outstandingPreviousPayments = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return users
      .flatMap((user) => user.payments)
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        const isPreviousMonth =
          paymentDate.getMonth() !== currentMonth ||
          paymentDate.getFullYear() !== currentYear;
        const isPendingOrOverdue = ["Pending", "Overdue"].includes(
          payment.status
        );
        return isPreviousMonth && isPendingOrOverdue;
      })
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users]);

  const outstandingCurrentPayments = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return users
      .flatMap((user) => user.payments)
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        const isCurrentMonth =
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear;
        const isPendingOrOverdue = ["Pending", "Overdue"].includes(
          payment.status
        );
        return isCurrentMonth && isPendingOrOverdue;
      })
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users]);
  const totalPayments = useMemo(() => {
    return users
      .flatMap((user) => user.payments)
      .reduce((sum, payment) => sum + payment.discountedAmount, 0);
  }, [users]);

  // Calculate resolved payments
  const calculateResolvedPayments = useMemo(() => {
    return totalPayments - outstandingPayments;
  }, [totalPayments, outstandingPayments]);

  const [granularity, setGranularity] = useState<Granularity>("month");

  // Calculate chart data directly in the dashboard
  // Calculate chart data using correct fields
  const { lineChartData, currentPeriodLabel } = useMemo(() => {
    // Get all paid payments with valid paid dates
    const paidPayments = users.flatMap(
      (user) =>
        user.payments?.filter(
          (payment) => payment.status === "Paid" && payment.paidDate
        ) || []
    );

    // Get all user creation dates
    const userCreationDates = users.map((user) => new Date(user.createdAt));

    // Get all payment dates from paid payments
    const paymentDates = paidPayments.map(
      (payment) => new Date(payment.paidDate!)
    );

    // Find date range boundaries
    const allDates = [...userCreationDates, ...paymentDates];
    if (allDates.length === 0)
      return { lineChartData: [], currentPeriodLabel: "" };

    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    // Generate period data
    const periods = generatePeriods(minDate, maxDate, granularity);

    // Calculate cumulative users and revenue for each period
    const data = periods.map((period) => {
      // Calculate revenue for period
      const revenue = paidPayments
        .filter((payment) =>
          isDateInPeriod(new Date(payment.paidDate!), period.start, period.end)
        )
        .reduce((sum, payment) => sum + payment.discountedAmount, 0);

      // Calculate cumulative users up to period end
      const users = userCreationDates.filter(
        (creationDate) => creationDate <= period.end
      ).length;

      return {
        period: period.label,
        timestamp: period.start.getTime(),
        revenue,
        users,
      };
    });

    // Get current period label
    const currentDate = new Date();
    const currentPeriod = getPeriodForDate(currentDate, granularity);

    return {
      lineChartData: data.sort((a, b) => a.timestamp - b.timestamp),
      currentPeriodLabel: currentPeriod.label,
    };
  }, [users, granularity]);

  return (
    <div className="p-6 space-y-8 h-full w-full pb-72 bg-gray-900">
      <DashboardHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <StatCard
          icon={<FaUsers />}
          title="Active Users"
          value={totalUsers}
          label={`New This Month: ${usersThisMonth}`}
          progress={100}
          subColor="#2563EB"
          color="#1E3A8A"
        />
        <StatCard
          icon={<FaBoxOpen />}
          title="Total Packages"
          value={totalPackages.toLocaleString()}
          label={`This Month: ${packagesSoldThisMonth.toLocaleString()}`}
          progress={Math.round(
            (packagesSoldThisMonth / totalPackages) * 100 || 0
          )}
          subColor="#10B981"
          color="#065F46"
        />
        <StatCard
          icon={<FaWallet />}
          title="Monthly Revenue"
          value={`$${totalPaymentsThisMonth.toLocaleString()}`}
          label={`This Week: $${totalPaymentsThisWeek.toLocaleString()}`}
          progress={75}
          subColor="#F59E0B"
          color="#B45309"
        />
        <StatCard
          icon={<FaClock />}
          title="Pending Payments"
          value={`$${outstandingCurrentPayments.toLocaleString()}`}
          label={`Previous Overdue: $${outstandingPreviousPayments.toLocaleString()}`}
          progress={Math.round(
            (calculateResolvedPayments / totalPayments) * 100 || 0
          )}
          subColor="#EF4444"
          color="#991B1B"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-blue-400" />}
          title="Add User"
          onClick={() => {
            setSelectedUser(null);
            setAddFormVisible(true);
          }}
          color="from-gray-900 to-gray-800"
          tooltip="Add a new user to the system"
        />
        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-purple-400" />}
          title="Add Package"
          onClick={() => setShowPackageForm(true)}
          color="from-gray-900 to-gray-800"
          tooltip="Create a new package plan"
        />

        <QuickActionCard
          icon={<HiOutlinePlusCircle size={28} className="text-purple-400" />}
          title="Add Task"
          onClick={() => setIsModalOpen(true)}
          color="from-gray-900 to-gray-800"
          tooltip="Create a new Task"
        />

        <TaskCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={() => setAddTaskShowSuccessRibbon(true)}
        />
      </div>

      {/* Reuse UsersForm */}
      {isAddFormVisible && (
        <UsersForm
          user={selectedUser}
          packages={packages}
          onSubmit={handleSubmit}
          onCancel={() => {
            setAddFormVisible(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Package Form Modal */}
      {showPackageForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <PackageForm
            onSubmit={handleAddPackage}
            onCancel={() => setShowPackageForm(false)}
          />
        </div>
      )}

      {/* Success Ribbon User*/}
      {showAddUserSuccessRibbon && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span>User Added Successfully!</span>
          <motion.div
            className="h-1 bg-white rounded-full"
            style={{ width: "100%" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 8 }}
          ></motion.div>
        </div>
      )}
      {/* Success Ribbon Package */}
      {showAddPackageSuccessRibbon && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span>Package Added Successfully!</span>
          <motion.div
            className="h-1 bg-white rounded-full"
            style={{ width: "100%" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 8 }}
          ></motion.div>
        </div>
      )}
      {/* Success Ribbon */}
      {showAddTaskSuccessRibbon && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-4">
          <span>Task Added Successfully!</span>
          <motion.div
            className="h-1 bg-white rounded-full"
            style={{ width: "100%" }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 8 }}
          ></motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        {" "}
        {/* First Row */}
        {/* Revenue & User Growth - Larger Width */}
        <div className="xl:col-span-2 h-full">
          {" "}
          {/* Added h-full */}
          <ChartCard
            title={`Revenue & User Growth (${currentPeriodLabel})`}
            infoTooltip="Shows revenue and user growth trends over time."
            borderColor="hover:border-blue-400"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded ${
                  granularity === "year" ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setGranularity("year")}
              >
                Year
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  granularity === "month" ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setGranularity("month")}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  granularity === "week" ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setGranularity("week")}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  granularity === "day" ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setGranularity("day")}
              >
                Day
              </button>
            </div>

            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="period" tick={{ fill: "#CBD5E1" }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#06B6D4" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        {/* Recent Transactions - Smaller Width */}
        <div className="xl:col-span-1 h-full">
          {" "}
          {/* Added h-full */}
          <ChartCard
            title="Recent Transactions"
            infoTooltip="List of recent transactions and amounts."
            borderColor="hover:border-green-400"
          >
            <div className="h-64 sm:h-80 overflow-y-auto custom-scrollbar pr-2">
              {/* Consistent height */}
              <RecentTransactions />
            </div>
          </ChartCard>
        </div>
        {/* Second Row */}
        {/* Payment Status Distribution - Current Month */}
        <div className="col-span-1">
          <ChartCard
            title="Payment Statuses This Month"
            infoTooltip="Distribution of Paid, Pending, and Overdue payments for current month."
            borderColor="hover:border-purple-400"
          >
            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    outerRadius={80}
                    animationDuration={400} // Keep animation
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                        stroke="#1F2937" // Dark border
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "8px",
                      border: "1px solid #374151",
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-gray-300">{value}</span>
                    )}
                    payload={pieChartData.map((item, index) => ({
                      id: item.name,
                      type: "circle",
                      value: `${item.name}`,
                      color: COLORS[index % COLORS.length],
                    }))}
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch ">
        <div className=" flex flex-col border rounded-lg hover:border-teal-400">
          <TasksList />
        </div>

        <div className="col-span-2  rounded-lg border hover:border-blue-400">
          <CalendarView />
        </div>
      </div>
    </div>
  );
};
// Helper functions
function generatePeriods(start: Date, end: Date, granularity: Granularity) {
  const periods = [];
  let current = new Date(start);

  while (current <= end) {
    const period = getPeriodForDate(current, granularity);
    periods.push(period);
    current = addPeriod(current, granularity);
  }

  return periods;
}

function getPeriodForDate(date: Date, granularity: Granularity) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const week = getWeekNumber(date);

  switch (granularity) {
    case "year":
      return {
        label: `${year}`,
        start: new Date(year, 0, 1),
        end: new Date(year + 1, 0, 0, 23, 59, 59, 999),
      };
    case "month":
      return {
        label: `${year}-${month.toString().padStart(2, "0")}`,
        start: new Date(year, month - 1, 1),
        end: new Date(year, month, 0, 23, 59, 59, 999),
      };
    case "week":
      return {
        label: `${year}-W${week.toString().padStart(2, "0")}`,
        start: getWeekStart(date),
        end: getWeekEnd(date),
      };
    case "day": {
      // Wrap in block scope
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return {
        label: date.toISOString().split("T")[0],
        start,
        end,
      };
    }
    default: {
      const exhaustiveCheck: never = granularity;
      return exhaustiveCheck;
    }
  }
}

function addPeriod(date: Date, granularity: Granularity) {
  const newDate = new Date(date);
  switch (granularity) {
    case "year":
      newDate.setFullYear(date.getFullYear() + 1);
      break;
    case "month":
      newDate.setMonth(date.getMonth() + 1);
      break;
    case "week":
      newDate.setDate(date.getDate() + 7);
      break;
    case "day":
      newDate.setDate(date.getDate() + 1);
      break;
  }
  return newDate;
}

function getWeekNumber(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekEnd(date: Date) {
  const start = getWeekStart(date);
  return new Date(start.setDate(start.getDate() + 6));
}

// Update the isDateInPeriod function
function isDateInPeriod(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}
export default Dashboard;
