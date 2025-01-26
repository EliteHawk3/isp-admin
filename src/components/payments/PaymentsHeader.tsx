import React, { useState, useEffect, useMemo } from "react";
import { useUsers } from "../../context/UsersContext";

interface PaymentsHeaderProps {
  onDownload: (filters: {
    months: string[];
    all: boolean;
    statuses: string[];
  }) => void;
}

const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({ onDownload }) => {
  const { users } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredPayments = useMemo(() => {
    return users.flatMap((user) =>
      user.payments.filter((payment) => {
        const paymentDate = new Date(payment.date || "");
        const paidDate = new Date(payment.paidDate || "");
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        const paidYear = paidDate.getFullYear();
        const paidMonth = paidDate.getMonth();

        const isCurrentMonth =
          paymentYear === currentYear && paymentMonth === currentMonth;

        const isPaidInCurrentMonth =
          payment.status === "Paid" &&
          paidYear === currentYear &&
          paidMonth === currentMonth;

        const isOverdueOrPendingFromPreviousMonths =
          ["Pending", "Overdue"].includes(payment.status) &&
          (paymentYear < currentYear || paymentMonth < currentMonth);

        return (
          isCurrentMonth ||
          isPaidInCurrentMonth ||
          isOverdueOrPendingFromPreviousMonths
        );
      })
    );
  }, [users, currentMonth, currentYear]);

  const paymentsCount = filteredPayments.length;

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    filteredPayments.forEach((payment) => {
      const date = new Date(payment.date || "");
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthsSet.add(monthYear);
    });
    return Array.from(monthsSet).sort();
  }, [filteredPayments]);

  const availableStatuses = useMemo(() => ["Paid", "Pending", "Overdue"], []);

  useEffect(() => {
    if (isModalOpen) {
      if (selectAll) {
        setSelectedMonths([]);
        setSelectedStatuses(availableStatuses);
      } else {
        setSelectedStatuses([]);
      }
    }
  }, [isModalOpen, availableStatuses, selectAll]);

  const toggleMonthSelection = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const toggleStatusSelection = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleConfirm = () => {
    if (!selectAll && selectedMonths.length === 0) {
      alert("Please select at least one month to download payments.");
      return;
    }

    if (!selectAll && selectedStatuses.length === 0) {
      alert("Please select at least one status to download payments.");
      return;
    }

    onDownload({
      months: selectedMonths,
      all: selectAll,
      statuses: selectAll ? availableStatuses : selectedStatuses,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
          Payments
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Total {paymentsCount} Payments
        </p>
      </div>

      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-3 rounded-lg shadow-md"
        >
          Download Payments
        </button>

        {isModalOpen && (
          <div
            role="dialog"
            aria-labelledby="download-options-title"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg text-white w-[90%] sm:w-[400px]">
              <h2
                id="download-options-title"
                className="text-lg font-bold mb-4"
              >
                Download Options
              </h2>
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => {
                      setSelectAll(e.target.checked);
                      if (e.target.checked) {
                        setSelectedMonths([]);
                        setSelectedStatuses(availableStatuses);
                      }
                    }}
                  />
                  <span>Select All Payments</span>
                </label>

                {!selectAll && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">
                      Select Months:
                    </h3>
                    {availableMonths.map((month) => (
                      <label
                        key={month}
                        className="flex items-center gap-2 mb-2 pl-4"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(month)}
                          onChange={() => toggleMonthSelection(month)}
                        />
                        <span>{month}</span>
                      </label>
                    ))}
                  </div>
                )}

                {!selectAll && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">
                      Select Statuses:
                    </h3>
                    {availableStatuses.map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 mb-2 pl-4"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() => toggleStatusSelection(status)}
                        />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700"
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

export default PaymentsHeader;
