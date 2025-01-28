import { useState, useMemo } from "react";
import NotificationsSideBar from "../components/notifications/NotificationsSideBar";
import NotificationsList from "../components/notifications/NotificationsList";
import NotificationsHeader from "../components/notifications/NotificationsHeader";
import NotificationsSummary from "../components/notifications/NotificationsSummary";
import { useUsers } from "../context/UsersContext";
import { usePackages } from "../context/PackagesContext";
import NotificationsHistory from "../components/notifications/NotificationsHistory";

const NotificationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { users } = useUsers();
  const { packages } = usePackages();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter payments for all categories, ignoring the selected category
  const allFilteredPayments = useMemo(() => {
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

        const matchesSearch =
          search.toLowerCase() === "" ||
          userName.includes(search.toLowerCase()) ||
          packageDetails?.name.toLowerCase().includes(search.toLowerCase());

        return matchesDateContext && matchesSearch;
      })
    );
  }, [users, packages, search, currentMonth, currentYear]);

  // Apply selected category filter
  const categoryFilteredPayments = useMemo(() => {
    if (selectedCategory === "all") return allFilteredPayments;

    return allFilteredPayments.filter(
      (payment) => payment.status.toLowerCase() === selectedCategory
    );
  }, [allFilteredPayments, selectedCategory]);

  // Handlers
  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  return (
    <div className=" h-screen overflow-y-auto custom-scrollbar flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <NotificationsHeader
        selectedCategory={selectedCategory}
        filteredPayments={categoryFilteredPayments}
      />

      <div className="flex">
        {/* Sidebar */}
        <NotificationsSideBar
          setSelectedCategory={handleCategorySelection}
          search={search}
          setSearch={setSearch}
          activeCategory={selectedCategory}
          onSearch={handleSearch}
          filteredPayments={allFilteredPayments} // Pass allFilteredPayments to sidebar
        />

        <div className="w-3/4 p-6">
          {/* Summary */}
          <NotificationsSummary />

          {/* Notifications List */}
          <NotificationsList payments={categoryFilteredPayments} />
          <NotificationsHistory />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
