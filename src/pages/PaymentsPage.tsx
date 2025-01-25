import PaymentsHeader from "../components/payments/PaymentsHeader";
import PaymentsSummary from "../components/payments/PaymentsSummary";
import PaymentsList from "../components/payments/PaymentsList";
import PaymentsSidebar from "../components/payments/PaymentsSideBar";
import { useUsers } from "../context/UsersContext";
import { usePackages } from "../context/PackagesContext";
import { Payment } from "../types/payments";
import { useState, useMemo } from "react";

const PaymentsPage = () => {
  const { users, markAsPaid, markAsUnpaid, setUsers } = useUsers();
  const { packages } = usePackages();

  const payments: Payment[] = users.flatMap((user) => user.payments || []);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const user = users.find((user) => user.id === payment.userId);
      const packageDetails = packages.find(
        (pkg) => pkg.id === payment.packageId
      );

      const matchesCategory =
        selectedCategory === "all" ||
        payment.status.toLowerCase() === selectedCategory;

      const matchesSearch =
        user?.name.toLowerCase().includes(search.toLowerCase()) ||
        packageDetails?.name.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [payments, selectedCategory, search, users, packages]);

  const getUserNameById = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getPackageDetailsById = (packageId: string) => {
    const packageItem = packages.find((pkg) => pkg.id === packageId);
    return packageItem
      ? { name: packageItem.name, price: packageItem.cost }
      : { name: "Unknown", price: 0 };
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
      {/* Header */}
      <PaymentsHeader
        totalPaymentsCount={payments.length}
        payments={payments}
      />

      <div className="flex">
        {/* Sidebar */}
        <PaymentsSidebar
          allCount={payments.length}
          pendingCount={payments.filter((p) => p.status === "Pending").length}
          paidCount={payments.filter((p) => p.status === "Paid").length}
          overdueCount={payments.filter((p) => p.status === "Overdue").length}
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
          activeCategory={selectedCategory}
          onSearch={setSearch}
        />

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <PaymentsSummary
            totalRevenue={payments
              .filter((p) => p.status === "Paid")
              .reduce((sum, p) => sum + p.discountedAmount, 0)}
            totalPaidUsers={payments.filter((p) => p.status === "Paid").length}
            outstandingPayments={payments
              .filter((p) => p.status === "Pending" || p.status === "Overdue")
              .reduce((sum, p) => sum + p.discountedAmount, 0)}
            outstandingUsers={
              payments.filter(
                (p) => p.status === "Pending" || p.status === "Overdue"
              ).length
            }
            userEngagement={
              (payments.filter((p) => p.status === "Paid").length /
                users.length) *
                100 || 0
            }
          />

          <PaymentsList
            payments={filteredPayments}
            handleMarkAsPaid={handleMarkAsPaid}
            handleMarkAsUnpaid={handleMarkAsUnpaid}
            handleDeletePayment={handleDeletePayment}
            getUserNameById={getUserNameById}
            getPackageDetailsById={getPackageDetailsById}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
