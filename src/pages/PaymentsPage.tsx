import PaymentsSummary from "../components/payments/PaymentsSummary";
import PaymentsList from "../components/payments/PaymentsList";
import PaymentsSidebar from "../components/payments/PaymentsSideBar";
import PaymentHistory from "../components/payments/PaymentsHistory";
import { useUsers } from "../context/UsersContext";
import { usePackages } from "../context/PackagesContext";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import PaymentsHeader from "../components/payments/PaymentsHeader";
import RevenueReport from "../components/payments/RevenueReport";
const PaymentsPage = () => {
  const { users, markAsPaid, markAsUnpaid, setUsers } = useUsers();
  const { packages } = usePackages();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isRevenueModalOpen, setRevenueModalOpen] = useState(false);

  const handleOpenRevenueModal = () => setRevenueModalOpen(true);
  const handleCloseRevenueModal = () => setRevenueModalOpen(false);
  const handleCloseHistory = () => setSelectedUser(null);

  // All payments flattened
  const allPayments = useMemo(() => {
    return users.flatMap((user) => user.payments);
  }, [users]);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  // Filter payments dynamically based on category and search
  const filteredPayments = useMemo(() => {
    return users.flatMap((user) =>
      user.payments.filter((payment) => {
        const paymentDate = new Date(payment.date || "");
        const paidDate = new Date(payment.paidDate || "");
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        const paidYear = paidDate.getFullYear();
        const paidMonth = paidDate.getMonth();

        const isCurrentMonthPayment =
          paymentYear === currentYear && paymentMonth === currentMonth;

        const isPaidInCurrentMonth =
          payment.status === "Paid" &&
          paidYear === currentYear &&
          paidMonth === currentMonth;

        const isPreviousMonthsPendingOrOverdue =
          ["Pending", "Overdue"].includes(payment.status) &&
          (paymentYear < currentYear ||
            (paymentYear === currentYear && paymentMonth < currentMonth));

        const matchesDateContext =
          isCurrentMonthPayment ||
          isPaidInCurrentMonth ||
          isPreviousMonthsPendingOrOverdue;

        const userName = user.name.toLowerCase();
        const packageDetails = packages.find(
          (pkg) => pkg.id === payment.packageId
        );

        const matchesCategory =
          selectedCategory === "all" ||
          payment.status.toLowerCase() === selectedCategory;

        const matchesSearch =
          search.toLowerCase() === "" ||
          userName.includes(search.toLowerCase()) ||
          packageDetails?.name.toLowerCase().includes(search.toLowerCase());

        // Combine date context and search/category filtering
        return matchesDateContext && matchesCategory && matchesSearch;
      })
    );
  }, [users, packages, selectedCategory, search, currentMonth, currentYear]);

  // Handle download logic for PaymentsHeader
  const handleDownload = (filters: {
    months: string[];
    all: boolean;
    statuses: string[];
  }) => {
    const filtered = allPayments.filter((payment) => {
      const paymentMonth = `${new Date(
        payment.paidDate || payment.date
      ).getFullYear()}-${
        new Date(payment.paidDate || payment.date).getMonth() + 1
      }`;

      const matchesMonth = filters.all || filters.months.includes(paymentMonth);
      const matchesStatus =
        filters.all || filters.statuses.includes(payment.status);

      return matchesMonth && matchesStatus;
    });

    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((payment) => ({
        ID: payment.id,
        User: payment.userId,
        Amount: `$${payment.discountedAmount.toFixed(2)}`,
        Status: payment.status,
        Date: payment.paidDate || payment.date,
        DueDate: payment.dueDate,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments.xlsx");
  };

  const handleMarkAsPaid = (
    userId: string,
    paymentId: string,
    amount: number
  ) => {
    markAsPaid(userId, paymentId, new Date().toISOString(), amount);
  };

  const handleMarkAsUnpaid = (userId: string, paymentId: string) => {
    markAsUnpaid(userId, paymentId);
  };

  const handleDeletePayment = (userId: string, paymentId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              payments: user.payments.filter(
                (payment) => payment.id !== paymentId
              ),
            }
          : user
      )
    );
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Payments Header */}
      <PaymentsHeader onDownload={handleDownload} />

      <div className="flex">
        {/* Sidebar */}
        <PaymentsSidebar
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
          activeCategory={selectedCategory}
          onSearch={setSearch}
        />

        <div className="w-3/4 p-6">
          {/* Payments Summary */}
          <PaymentsSummary onRevenueClick={handleOpenRevenueModal} />

          {/* Revenue Modal */}
          {isRevenueModalOpen && (
            <RevenueReport onClose={handleCloseRevenueModal} />
          )}

          {/* Payments List */}
          <PaymentsList
            payments={filteredPayments}
            handleMarkAsPaid={handleMarkAsPaid}
            handleMarkAsUnpaid={handleMarkAsUnpaid}
            handleDeletePayment={handleDeletePayment}
            onViewHistory={setSelectedUser}
            // activeCategory={selectedCategory}
          />

          {/* Payment History Modal */}
          {selectedUser && (
            <PaymentHistory
              selectedUserId={selectedUser}
              onClose={handleCloseHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
