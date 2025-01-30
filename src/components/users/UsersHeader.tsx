interface UsersHeaderProps {
  totalUsers: number;
  pendingUsers: number;
  paidUsers: number;
  overdueUsers: number;
  activeCategory: string;
}

const UsersHeader = ({
  totalUsers,
  pendingUsers,
  paidUsers,
  overdueUsers,
  activeCategory,
}: UsersHeaderProps) => {
  // Define category label and count dynamically
  let categoryLabel = "Total Users";
  let categoryCount = totalUsers;

  if (activeCategory === "pending") {
    categoryLabel = "Pending Users";
    categoryCount = pendingUsers;
  } else if (activeCategory === "paid") {
    categoryLabel = "Paid Users";
    categoryCount = paidUsers;
  } else if (activeCategory === "overdue") {
    categoryLabel = "Overdue Users";
    categoryCount = overdueUsers;
  }

  return (
    <div className="flex justify-between items-center ml-6 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide">Users</h1>
        <p className="mt-2 text-sm text-gray-400">{`${categoryLabel}: ${categoryCount}`}</p>
      </div>
    </div>
  );
};

export default UsersHeader;
