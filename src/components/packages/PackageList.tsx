// src/components/PackageList.tsx
import PackageCard from "./PackageCard";
import { Package } from "../../types/packages";

const PackageList = ({
  packages,
  onEdit,
  onDelete,
}: {
  packages: Package[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    aria-label="Package List"
  >
    {packages.length > 0 ? (
      packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    ) : (
      <div className="text-center text-gray-400 col-span-full">
        No packages available. Add a new package to get started.
      </div>
    )}
  </div>
);

export default PackageList;
