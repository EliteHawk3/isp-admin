// src/components/settings/OverviewStatistics.tsx
import React from "react";

const OverviewStatistics = () => {
  const statistics = {
    totalUsers: 1250,
    paidUsers: 900,
    unpaidUsers: 250,
    pendingUsers: 100,
    packages: [
      { name: "Basic Package", price: "$20", bandwidth: "20GB" },
      { name: "Premium Package", price: "$50", bandwidth: "100GB" },
      { name: "Business Package", price: "$100", bandwidth: "500GB" },
    ],
    mainPackage: { name: "Enterprise Plan", price: "$1000", bandwidth: "5TB" },
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Overview Statistics
      </h2>
      <div className="flex flex-col gap-4">
        <p>
          <strong>Total Users:</strong> {statistics.totalUsers}
        </p>
        <p>
          <strong>Paid Users:</strong> {statistics.paidUsers}
        </p>
        <p>
          <strong>Unpaid Users:</strong> {statistics.unpaidUsers}
        </p>
        <p>
          <strong>Pending Payments:</strong> {statistics.pendingUsers}
        </p>
        <h3 className="mt-4 text-lg font-bold text-white">Packages:</h3>
        {statistics.packages.map((pkg, index) => (
          <p key={index}>
            <strong>{pkg.name}:</strong> {pkg.bandwidth} for {pkg.price}
          </p>
        ))}
        <h3 className="mt-4 text-lg font-bold text-white">Main Package:</h3>
        <p>
          <strong>{statistics.mainPackage.name}:</strong>{" "}
          {statistics.mainPackage.bandwidth} for {statistics.mainPackage.price}
        </p>
      </div>
    </div>
  );
};

export default OverviewStatistics;
