// src/components/PackagesSummary.tsx
import { motion } from "framer-motion";
import { useState } from "react";

const PackagesSummary = ({
  totalMBsPackage = 0,
  providerCost = 0,
  totalPackagesSold = 0,
  totalIncome = 0,
  profit = 0,
  onEditMBs = () => {},
}: {
  totalMBsPackage: number;
  providerCost: number;
  totalPackagesSold: number;
  totalIncome: number;
  profit: number;
  onEditMBs: (editedMBs: number, editedCost: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTotalMBs, setEditedTotalMBs] = useState(totalMBsPackage);
  const [editedProviderCost, setEditedProviderCost] = useState(providerCost);

  const handleSave = () => {
    onEditMBs(editedTotalMBs, editedProviderCost);
    setIsEditing(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-b pb-8 border-gray-700">
        {/* Total MBs Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-teal-500 via-teal-700 to-teal-900 p-5 rounded-xl shadow-2xl flex flex-col items-center justify-center relative transition-transform"
        >
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-bold text-gray-200">Total MBs</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setIsEditing(true);
                setEditedTotalMBs(totalMBsPackage);
                setEditedProviderCost(providerCost);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Edit Total MBs"
            >
              Edit
            </motion.button>
          </div>
          <p className="text-3xl font-bold text-white mt-2">
            {totalMBsPackage || 0} Mbps
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Cost: ${providerCost.toFixed(2)}
          </p>
        </motion.div>

        {/* Total Packages Sold Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 via-indigo-700 to-indigo-900 p-5 rounded-xl shadow-2xl flex flex-col items-center justify-center transition-transform"
        >
          <h2 className="text-lg font-bold text-gray-200">
            Total Packages Sold
          </h2>
          <p className="text-3xl font-bold text-white mt-2">
            {totalPackagesSold}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Total Income:{" "}
            <span className="font-bold text-gray-100">
              ${totalIncome.toFixed(2)}
            </span>
          </p>
        </motion.div>

        {/* Profit/Loss Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-5 rounded-xl shadow-2xl flex flex-col items-center justify-center transition-transform ${
            profit >= 0
              ? "bg-gradient-to-br from-green-500 via-green-700 to-green-900"
              : "bg-gradient-to-br from-red-500 via-red-700 to-red-900"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-200">
            {profit >= 0 ? "Profit" : "Loss"}
          </h2>
          <p className="text-3xl font-bold text-white mt-2">
            ${profit.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {profit >= 0 ? "You're making profit!" : "Loss incurred."}
          </p>
        </motion.div>
      </div>

      {/* Inline Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Total MBs and Cost</h2>

            {/* Total MBs Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Total MBs (Mbps):
              </label>
              <input
                type="number"
                value={editedTotalMBs}
                onChange={(e) => setEditedTotalMBs(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Provider Cost Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Provider Cost ($):
              </label>
              <input
                type="number"
                value={editedProviderCost}
                onChange={(e) => setEditedProviderCost(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackagesSummary;
