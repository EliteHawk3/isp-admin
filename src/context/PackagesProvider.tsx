// src/context/PackagesProvider.tsx
import { useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { PackagesContext } from "./PackagesContext";
import { Package } from "../types/packages";
import { packages as initialPackages } from "../data/packages"; // Importing mock data

const PackagesProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [totalMBs, setTotalMBs] = useState<number>(500); // Default Total MBs
  const [providerCost, setProviderCost] = useState<number>(500); // Default Cost of Total MBs

  /**
   * Fetch packages from localStorage or initialize from mock data.
   */
  const fetchPackages = useCallback(async () => {
    try {
      // Check if packages are stored in localStorage
      const storedPackages = localStorage.getItem("packages");
      if (storedPackages) {
        const parsedPackages: Package[] = JSON.parse(storedPackages);
        if (parsedPackages.length > 0) {
          setPackages(parsedPackages);
          console.log(
            "PackagesProvider: Loaded packages from localStorage:",
            parsedPackages
          );
        } else {
          // If the stored array is empty, load mock data
          const initializedPackages = initialPackages.map((pkg) => ({
            ...pkg,
            users: 0, // Ensure users count starts at 0
          }));
          setPackages(initializedPackages);
          console.log(
            "PackagesProvider: Loaded packages from mock data due to empty localStorage.",
            initializedPackages
          );
        }
      } else {
        // If no packages in localStorage, load mock data
        const initializedPackages = initialPackages.map((pkg) => ({
          ...pkg,
          users: 0, // Ensure users count starts at 0
        }));
        setPackages(initializedPackages);
        console.log(
          "PackagesProvider: Loaded packages from mock data:",
          initializedPackages
        );
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }, []);

  /**
   * Add a new package.
   */
  const addPackage = useCallback(
    (newPackage: Package) => {
      const updatedPackages = [...packages, { ...newPackage, users: 0 }];
      setPackages(updatedPackages);
      console.log("PackagesProvider: Added new package:", newPackage);
    },
    [packages]
  );

  /**
   * Edit an existing package.
   */
  const editPackage = useCallback(
    (updatedPackage: Package) => {
      const updatedPackages = packages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      );
      setPackages(updatedPackages);
      console.log("PackagesProvider: Edited package:", updatedPackage);
    },
    [packages]
  );

  /**
   * Delete a package.
   */
  const deletePackage = useCallback(
    (id: string) => {
      const updatedPackages = packages.filter((pkg) => pkg.id !== id);
      setPackages(updatedPackages);
      console.log(`PackagesProvider: Deleted package with id: ${id}`);
    },
    [packages]
  );

  /**
   * Update user count for a specific package.
   */
  // const updatePackageUsers = useCallback(
  //   (packageId: string, userCount: number) => {
  //     const updatedPackages = packages.map((pkg) =>
  //       pkg.id === packageId ? { ...pkg, users: userCount } : pkg
  //     );
  //     setPackages(updatedPackages);
  //     console.log(
  //       `PackagesProvider: Updated user count for package ${packageId}: ${userCount}`
  //     );
  //   },
  //   [packages]
  // );

  /**
   * Update package prices in bulk.
   */
  // const updatePackagePrices = useCallback(
  //   (updatedPrices: { id: string; cost: number }[]) => {
  //     const updatedPackages = packages.map((pkg) => {
  //       const priceUpdate = updatedPrices.find((price) => price.id === pkg.id);
  //       return priceUpdate ? { ...pkg, cost: priceUpdate.cost } : pkg;
  //     });
  //     setPackages(updatedPackages);
  //     console.log("PackagesProvider: Updated package prices:", updatedPrices);
  //   },
  //   [packages]
  // );

  /**
   * Initialize packages on mount.
   */
  useEffect(() => {
    fetchPackages(); // Fetch initial packages
  }, [fetchPackages]);

  /**
   * Persist packages to localStorage whenever they change.
   */
  useEffect(() => {
    try {
      localStorage.setItem("packages", JSON.stringify(packages));
      console.log(
        "PackagesProvider: Persisted packages to localStorage:",
        packages
      );
    } catch (error) {
      console.error("Error persisting packages to localStorage:", error);
    }
  }, [packages]);

  /**
   * Memoize context value to prevent unnecessary re-renders.
   */
  const contextValue = useMemo(
    () => ({
      packages,
      setPackages,
      totalMBs,
      providerCost,
      setTotalMBs,
      setProviderCost,
      fetchPackages,
      addPackage,
      editPackage,
      deletePackage,
      // updatePackageUsers,
      // updatePackagePrices,
    }),
    [
      packages,
      totalMBs,
      providerCost,
      fetchPackages,
      addPackage,
      editPackage,
      deletePackage,
      // updatePackageUsers,
      // updatePackagePrices,
    ]
  );

  return (
    <PackagesContext.Provider value={contextValue}>
      {children}
    </PackagesContext.Provider>
  );
};

export default PackagesProvider;
