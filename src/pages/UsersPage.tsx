import React, { useState, useEffect } from "react";
import UsersList from "../components/users/UsersList";
import { useUsers } from "../context/UsersContext";
import { usePackages } from "../context/PackagesContext";
import { User } from "../types/users";
import UsersHeader from "../components/users/UsersHeader";
import UsersDetail from "../components/users/UsersDetail";
import UsersForm from "../components/users/UsersForm";
import UsersSidebarSection from "../components/users/UsersSidebarSection";
const UsersPage: React.FC = () => {
  const {
    users,
    fetchUsers,
    addUser,
    editUser,
    // If you need deleteUser or markAsPaid, markAsUnpaid, import them here as well
  } = useUsers();

  const { packages } = usePackages();

  // Store only the currently selected user's ID
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Controls whether the "Add / Edit" form is open
  const [isFormVisible, setFormVisible] = useState(false);

  // Search and category state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch mock data once on mount (if you're not overwriting local changes)
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * The selected user object is derived from 'users' in context
   * so it's always the latest data (e.g. after edits).
   */
  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  /**
   * If 'selectedUserId' is non-null but the user was deleted (or doesn't exist),
   * 'selectedUser' will be undefined. This effect resets the selection so
   * the detail panel disappears if the user no longer exists in context.
   */
  useEffect(() => {
    if (selectedUserId && !selectedUser) {
      setSelectedUserId(null);
    }
  }, [selectedUserId, selectedUser]);

  // Sidebar counts
  const allCount = users.length;
  const paidCount = users.filter((u) =>
    u.payments?.some((p) => p.status === "Paid")
  ).length;
  const pendingCount = users.filter((u) =>
    u.payments?.some((p) => p.status === "Pending")
  ).length;
  const overdueCount = users.filter((u) =>
    u.payments?.some((p) => p.status === "Overdue")
  ).length;

  // Clicking "Add User" in the sidebar clears any selection and opens form in add mode
  const handleAddUser = () => {
    setSelectedUserId(null);
    setFormVisible(true);
  };

  /**
   * Called when the UserForm is submitted. If we have a 'selectedUser',
   * it's an edit; otherwise, it's a new user. We then re-select the updated user.
   */
  const handleSubmitUserForm = async (updatedUser: User) => {
    if (selectedUser) {
      // Edit an existing user
      await editUser(updatedUser);
    } else {
      // Add a new user
      await addUser(updatedUser);
    }
    setFormVisible(false);
    // Ensure the newly updated/added user is selected
    setSelectedUserId(updatedUser.id);
    // Do not re-fetch mock data here, or you'll overwrite local changes
  };

  /**
   * Filter 'users' by search and category
   */
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.cnic?.toLowerCase().includes(query);

    let matchesCategory = true;
    if (activeCategory === "paid") {
      matchesCategory =
        user.payments?.some((p) => p.status === "Paid") ?? false;
    } else if (activeCategory === "pending") {
      matchesCategory =
        user.payments?.some((p) => p.status === "Pending") ?? false;
    } else if (activeCategory === "overdue") {
      matchesCategory =
        user.payments?.some((p) => p.status === "Overdue") ?? false;
    }
    // If activeCategory === "all", no extra check needed

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 min-h-screen">
      <UsersHeader userCount={users.length} />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Section */}
        <UsersSidebarSection
          allCount={allCount}
          paidCount={paidCount}
          pendingCount={pendingCount}
          overdueCount={overdueCount}
          onCategoryChange={(category) => setActiveCategory(category)}
          activeCategory={activeCategory}
          onAddUser={handleAddUser}
        />

        {/* Users List Section */}
        <UsersList
          users={filteredUsers}
          selectedUserId={selectedUserId} // highlight the current selection
          setSelectedUserId={setSelectedUserId}
          onSearch={(query) => setSearchQuery(query)}
        />

        {/* User Detail Panel */}
        {selectedUser && <UsersDetail user={selectedUser} />}

        {/* User Form Modal (Add or Edit) */}
        {isFormVisible && (
          <UsersForm
            user={selectedUser} // null => add mode, otherwise edit mode
            packages={packages}
            onSubmit={handleSubmitUserForm}
            onCancel={() => setFormVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;