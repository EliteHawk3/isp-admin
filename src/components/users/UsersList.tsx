import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { MdCheckCircle, MdPending, MdErrorOutline } from "react-icons/md";

import { User } from "../../types/users";
import { Package } from "../../types/packages";
import { usePackages } from "../../context/PackagesContext";

interface UsersListProps {
  /** List of user objects, possibly already filtered. */
  users: User[];

  /** The currently selected user's ID, or null if none is selected. */
  selectedUserId: string | null;

  /** Callback to set the selected user's ID. */
  setSelectedUserId: (id: string | null) => void;

  /** Callback to handle the search query from the search box. */
  onSearch: (query: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  selectedUserId,
  setSelectedUserId,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch packages from your custom hook.
  // If you prefer, you could do useContext(PackagesContext) directly
  // as long as PackagesContext is properly typed.
  const { packages } = usePackages();

  /**
   * Debounce the search calls, so we only call `onSearch`
   * 300ms after the user stops typing.
   */
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        onSearch(query);
      }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  /**
   * Determine which status icon to show based on the user's payment statuses.
   */
  const getStatusIcon = (user: User) => {
    if (user.payments?.some((p) => p.status === "Overdue")) {
      return <MdErrorOutline className="text-red-500 text-lg" />;
    }
    if (user.payments?.some((p) => p.status === "Pending")) {
      return <MdPending className="text-teal-400 text-lg" />;
    }
    if (user.payments?.some((p) => p.status === "Paid")) {
      return <MdCheckCircle className="text-green-500 text-lg" />;
    }
    // Default to a gray pending icon if no payments exist
    return <MdPending className="text-gray-500 text-lg" />;
  };

  /**
   * Generate a fun avatar for each user (DiceBear).
   */
  const getCartoonAvatar = (id: string) =>
    `https://api.dicebear.com/5.x/adventurer/svg?seed=${id}`;

  /**
   * If the user typed in a search, highlight the matching substring.
   */
  const highlightSearchTerm = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="text-blue-500 font-bold">${match}</span>`
    );
  };

  return (
    <div
      className="w-full lg:w-1/4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 
                 rounded-xl shadow-2xl h-[85vh] flex flex-col"
    >
      <div className="mb-6">
        <div className="relative flex items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name, phone, or package..."
            className="w-full px-5 py-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 text-gray-300 
                 border border-gray-600 shadow-md placeholder-gray-500 focus:ring-2 focus:ring-blue-500 
                 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Users"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Clear Search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {users.length > 0 ? (
          users.map((user) => {
            // Find the user's package from the context array
            const packageDetails = packages.find(
              (pkg: Package) => pkg.id === user.packageId
            );

            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg cursor-pointer flex items-center gap-4
                  transition-all ${
                    selectedUserId === user.id
                      ? "bg-gray-700 shadow-lg border border-blue-500"
                      : "hover:bg-gray-700 hover:bg-opacity-50"
                  }`}
                onClick={() => setSelectedUserId(user.id)}
                role="button"
                aria-pressed={selectedUserId === user.id}
                aria-selected={selectedUserId === user.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedUserId(user.id);
                  }
                }}
              >
                {/* Avatar */}
                <img
                  src={getCartoonAvatar(user.id)}
                  alt={`Avatar of ${user.name}`}
                  className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-sm"
                />

                {/* User Info */}
                <div className="flex-1">
                  <h3
                    className="font-semibold text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(user.name),
                    }}
                  />
                  <p
                    className="text-sm text-gray-400"
                    dangerouslySetInnerHTML={{
                      __html: packageDetails
                        ? highlightSearchTerm(
                            `${packageDetails.name} - ${packageDetails.speed} Mbps`
                          )
                        : "No Package Assigned",
                    }}
                  />
                </div>

                {/* Status Icon */}
                <div>{getStatusIcon(user)}</div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center mt-8">
            {searchQuery
              ? "No users found matching your search."
              : "No users found. Try clearing filters or adding new users."}
          </p>
        )}
      </div>
    </div>
  );
};

export default UsersList;
