// src/pages/PackagesPage.tsx
import { useState } from "react";
import PackagesHeader from "../components/packages/PackagesHeader";
import PackagesSummary from "../components/packages/PackagesSummary";
import PackageList from "../components/packages/PackageList";
import PackageUsersChart from "../components/packages/PackageUsersChart";
import PackageForm from "../components/packages/PackageForm";
import { Package } from "../types/packages";
import { usePackages } from "../context/PackagesContext";
// Removed import of useUsers
// import { useUsers } from "../context/UsersContext"; // Import UsersContext

const PackagesPage = () => {
  const {
    packages,
    setPackages,
    totalMBs,
    providerCost,
    setTotalMBs,
    setProviderCost,
  } = usePackages();
  // Removed users fetching from UsersContext
  // const { users } = useUsers(); // Fetch users dynamically from UsersContext

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);

  // Handle editing Total MBs and Provider Cost through the modal
  const handleEditMBs = (editedMBs: number, editedCost: number) => {
    setTotalMBs(editedMBs);
    setProviderCost(editedCost);
  };

  // Open the Add Package form
  const handleAddPackage = () => {
    setSelectedPackage(null);
    setFormVisible(true);
  };

  // Open the Edit Package form
  const handleEditPackage = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) {
      setSelectedPackage(pkg);
      setFormVisible(true);
    }
  };

  // Delete a package
  const handleDeletePackage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== id)
      );
    }
  };

  // Handle form submission for Add/Edit Package
  const handleFormSubmit = (pkg: Package) => {
    setPackages((prevPackages) => {
      if (selectedPackage) {
        // Edit existing package
        return prevPackages.map((p) =>
          p.id === pkg.id ? { ...pkg, users: selectedPackage.users } : p
        );
      } else {
        // Add new package
        return [{ ...pkg, users: 0 }, ...prevPackages];
      }
    });
    setFormVisible(false);
  };

  const handleFormCancel = () => {
    setFormVisible(false);
  };

  // Dynamic Calculations based on packages data
  const totalPackagesSold = packages.reduce((sum, pkg) => sum + pkg.users, 0);

  const totalIncome = packages.reduce(
    (sum, pkg) => sum + pkg.users * pkg.cost,
    0
  );

  const profit = totalIncome - providerCost;

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <PackagesHeader onAdd={handleAddPackage} />

      {/* Summary Section */}
      <PackagesSummary
        totalMBsPackage={totalMBs}
        providerCost={providerCost}
        totalPackagesSold={totalPackagesSold}
        totalIncome={totalIncome}
        profit={profit}
        onEditMBs={handleEditMBs} // Pass modal edit handler
      />

      {/* Packages List */}
      {packages.length > 0 ? (
        <PackageList
          packages={packages}
          onEdit={handleEditPackage}
          onDelete={handleDeletePackage}
        />
      ) : (
        <div className="text-center text-gray-400">
          No packages available. Add a new package to get started.
        </div>
      )}

      {/* Users Per Package Chart */}
      <PackageUsersChart packages={packages} />

      {/* Add/Edit Package Form */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <PackageForm
            pkg={selectedPackage || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
};

export default PackagesPage;
