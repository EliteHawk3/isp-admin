// src/context/AdminProvider.tsx
import React, { useState, useCallback } from "react";
import { AdminContext, AdminDetails } from "./AdminContext";

const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    id: "A001",
    name: "Junaid Ehsan",
    phone: "+44 2456 7890",
    profilePic: "/src/assets/10.jpg",
  });

  // Use useCallback to stabilize the function reference
  const updateAdminDetails = useCallback((updates: Partial<AdminDetails>) => {
    setAdminDetails((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AdminContext.Provider value={{ adminDetails, updateAdminDetails }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
