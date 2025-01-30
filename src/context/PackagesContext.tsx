// src/context/PackagesContext.tsx
import { createContext, useContext } from "react";
import { Package } from "../types/packages";

/**
 * Defines the structure of the PackagesContext.
 */
interface PackagesContextType {
  packages: Package[]; // List of all packages
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>; // Update packages
  totalMBs: number; // Total MBs provided by the main ISP
  setTotalMBs: React.Dispatch<React.SetStateAction<number>>; // Update total MBs
  providerCost: number; // Monthly cost for total MBs
  setProviderCost: React.Dispatch<React.SetStateAction<number>>; // Update provider cost
  fetchPackages: () => Promise<void>; // Fetch all packages
  addPackage: (newPackage: Package) => void; // Add a new package
  editPackage: (updatedPackage: Package) => void; // Edit an existing package
  deletePackage: (id: string) => void; // Delete a package
}

/**
 * Create the PackagesContext with an undefined default value.
 * Consumers must ensure they are within a PackagesProvider.
 */
export const PackagesContext = createContext<PackagesContextType | undefined>(
  undefined
);

/**
 * Custom hook to consume the PackagesContext safely.
 * Ensures the hook is only used within a valid PackagesProvider.
 */
export const usePackages = (): PackagesContextType => {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error("usePackages must be used within a PackagesProvider");
  }
  return context;
};
