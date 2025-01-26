import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import { FaDownload, FaCalendar, FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useUsers } from "../../context/UsersContext";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler
);

interface RevenueReportProps {
  onClose: () => void; // Function to close the modal
}

const RevenueReport: React.FC<RevenueReportProps> = ({ onClose }) => {
  const { users } = useUsers();
  const [showCurrentMonth, setShowCurrentMonth] = useState(true); // Toggle between current month and all months
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // Selected dates/months
  const [selectAll, setSelectAll] = useState(true); // Whether to show all data by default
  const [filteredRevenueArray, setFilteredRevenueArray] = useState<
    { label: string; amount: number }[]
  >([]);
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation modal

  // Flatten and filter payments from all users
  const payments = useMemo(() => {
    return users.flatMap((user) =>
      user.payments.filter((payment) => payment.status === "Paid")
    );
  }, [users]);

  // Group payments by daily or monthly data
  const revenueData = useMemo(() => {
    return payments.reduce((acc, payment) => {
      const paidDate = new Date(payment.paidDate!);
      const label = showCurrentMonth
        ? paidDate.toLocaleDateString(undefined, { day: "numeric" }) // Daily for current month
        : `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(
            2,
            "0"
          )}`; // Monthly for all months

      acc[label] = (acc[label] || 0) + payment.discountedAmount;
      return acc;
    }, {} as Record<string, number>);
  }, [payments, showCurrentMonth]);

  const revenueArray = useMemo(
    () =>
      Object.entries(revenueData).map(([label, amount]) => ({
        label,
        amount,
      })),
    [revenueData]
  );

  // Default selection based on the current view
  useEffect(() => {
    if (showCurrentMonth) {
      const dailyLabels = revenueArray.map((entry) => entry.label);
      setSelectedDates(dailyLabels);
    } else {
      setSelectAll(true); // Automatically show all months
      setSelectedDates([]); // Clear specific selections
    }
  }, [showCurrentMonth, revenueArray]);

  // Filter data based on selected dates or "Select All"
  useEffect(() => {
    if (selectAll || showCurrentMonth) {
      setFilteredRevenueArray(revenueArray);
    } else {
      const filtered = revenueArray.filter((entry) =>
        selectedDates.includes(entry.label)
      );
      setFilteredRevenueArray(filtered);
    }
  }, [selectedDates, selectAll, revenueArray, showCurrentMonth]);

  // Chart.js data and options
  const chartData = useMemo(
    () => ({
      labels: filteredRevenueArray.map((data) => data.label),
      datasets: [
        {
          label: "Revenue ($)",
          data: filteredRevenueArray.map((data) => data.amount),
          backgroundColor: "rgba(99, 102, 241, 0.4)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 2,
          fill: true,
        },
      ],
    }),
    [filteredRevenueArray]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: import("chart.js").TooltipItem<"line">) => {
              const rawValue = tooltipItem.raw as number | undefined;
              return rawValue !== undefined ? `$${rawValue.toFixed(2)}` : "N/A";
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: showCurrentMonth ? "Date" : "Month",
          },
        },
        y: {
          title: {
            display: true,
            text: "Revenue ($)",
          },
        },
      },
    }),
    [showCurrentMonth]
  );

  // Handle Excel export
  const handleDownload = () => {
    const filtered = filteredRevenueArray;
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Data");
    XLSX.writeFile(workbook, "RevenueReport.xlsx");

    setShowConfirmation(false); // Close the confirmation modal after download
  };

  // Toggle individual date/month selection
  const toggleDateSelection = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
    setSelectAll(false); // Deselect "Select All" when specific dates are toggled
  };

  // Handle "Select All" toggle
  const handleSelectAllToggle = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setFilteredRevenueArray(revenueArray); // Show all data
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[600px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600 px-3 py-2 rounded-full hover:bg-red-700"
          aria-label="Close Revenue Report"
        >
          <FaTimes className="text-white text-lg" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-6 text-center">
          {showCurrentMonth
            ? "Current Month Revenue Report"
            : "Monthly Revenue Report"}
        </h2>

        {/* Toggle Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowCurrentMonth(!showCurrentMonth)}
            className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <FaCalendar />
            {showCurrentMonth ? "Show All Months" : "Show Current Month"}
          </button>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Date/Month Selector */}
        {!showCurrentMonth && (
          <div className="mb-6">
            <label className="flex items-center text-gray-200 mb-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAllToggle(e.target.checked)}
                className="mr-2"
              />
              Select All Months
            </label>

            {!selectAll && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {revenueArray.map(({ label }) => (
                  <label
                    key={label}
                    className="flex items-center text-gray-200 bg-gray-700 p-2 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(label)}
                      onChange={() => toggleDateSelection(label)}
                      className="mr-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowConfirmation(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
          >
            <FaDownload />
            Download Revenue Report
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
              <h2 className="text-lg font-bold mb-4">Confirm Download</h2>
              <p className="mb-6">
                {selectAll
                  ? `You are about to download the revenue report for ${
                      showCurrentMonth ? "the current month" : "all months"
                    }.`
                  : `You are about to download the revenue report for the selected dates: ${
                      selectedDates.length > 0
                        ? selectedDates.join(", ")
                        : "No selection"
                    }.`}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueReport;
