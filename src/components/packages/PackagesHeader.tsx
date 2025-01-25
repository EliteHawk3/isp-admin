// src/components/PackagesHeader.tsx
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const PackagesHeader = ({
  onAdd,
  title = "Packages",
}: {
  onAdd: () => void;
  title?: string; // Allow customization of the title
}) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-extrabold tracking-wide">{title}</h1>
    <motion.button
      whileHover={{ scale: 1.1 }}
      onClick={onAdd}
      aria-label="Add Package"
      className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <FaPlus className="mr-2" /> Add Package
    </motion.button>
  </div>
);

export default PackagesHeader;
