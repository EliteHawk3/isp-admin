// src/components/PackageForm.tsx
import { useState } from "react";
import { Package } from "../../types/packages";
// Removed unused import of useUsers
// import { useUsers } from "../../context/UsersContext";

const PackageForm = ({
  pkg,
  onSubmit,
  onCancel,
}: {
  pkg?: Package; // Optional for "Add Package"
  onSubmit: (pkg: Package) => void;
  onCancel: () => void;
}) => {
  // Removed useUsers hook and usersCount state
  // const { users } = useUsers();

  // Form state
  const [name, setName] = useState(pkg?.name || "");
  const [speed, setSpeed] = useState(pkg?.speed || 0);
  const [cost, setCost] = useState(pkg?.cost || 0);
  // Removed usersCount state
  // const [usersCount, setUsersCount] = useState(0); // Local state for user count

  // Removed useEffect for updating user count
  /*
  useEffect(() => {
    if (pkg) {
      const count = users.filter((user) => user.packageId === pkg.id).length;
      setUsersCount(count);
    }
  }, [pkg, users]);
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || speed <= 0 || cost <= 0) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    // Use pkg.users if editing, else 0 for new package
    const userCount = pkg ? pkg.users : 0;

    // Submit the package data
    onSubmit({
      id: pkg?.id || Math.random().toString(36).substring(2, 9),
      name,
      speed,
      cost,
      users: userCount, // Use the existing user count or 0
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col gap-6"
    >
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-white tracking-wide">
        {pkg ? "Edit Package" : "Add Package"}
      </h2>

      {/* Form Fields */}
      <label className="text-sm text-gray-400 font-semibold">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter package name"
          className="mt-2 block w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </label>

      <label className="text-sm text-gray-400 font-semibold">
        Speed (Mbps):
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          placeholder="Enter speed (e.g., 100 Mbps)"
          className="mt-2 block w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
          required
        />
      </label>

      <label className="text-sm text-gray-400 font-semibold">
        Cost ($):
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          placeholder="Enter cost in dollars"
          className="mt-2 block w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
      </label>

      {/* Display User Count for Existing Packages */}
      {pkg && (
        <p className="text-sm text-gray-400">
          <strong>Users:</strong> {pkg.users}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-4 justify-end mt-6">
        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-gray-600/50 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PackageForm;
