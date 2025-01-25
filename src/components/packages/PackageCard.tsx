// src/components/PackageCard.tsx
import { motion } from "framer-motion";
import { Package } from "../../types/packages";
// Removed unused import of useUsers
// import { useUsers } from "../../context/UsersContext"; // Access dynamic user data
import {
  FaEdit,
  FaRocket,
  FaTachometerAlt,
  FaTrash,
  FaWifi,
} from "react-icons/fa";

const PackageCard = ({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: Package;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  // Removed userCount calculation as it's now handled by SynchronizationComponent
  // const { users } = useUsers();

  // Calculate the number of users subscribed to the given package
  // const userCount = users.filter((user) => user.packageId === pkg.id).length;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-gray-900 to-gray-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform flex flex-col justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full shadow-md">
          {pkg.speed <= 10 && <FaRocket className="text-green-400 text-2xl" />}
          {pkg.speed > 10 && pkg.speed <= 50 && (
            <FaTachometerAlt className="text-blue-400 text-2xl" />
          )}
          {pkg.speed > 50 && <FaWifi className="text-yellow-400 text-2xl" />}
        </div>
        <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-400">Speed: {pkg.speed} Mbps</p>
        <p className="text-sm text-gray-400">Cost: ${pkg.cost.toFixed(2)}</p>
        {/* Updated to use pkg.users instead of calculated userCount */}
        <p className="text-sm text-gray-400">Users: {pkg.users}</p>
      </div>
      <div className="mt-4 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onEdit(pkg.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaEdit />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onDelete(pkg.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
