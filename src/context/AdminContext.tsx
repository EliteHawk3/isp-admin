// src/context/AdminContext.tsx
import { createContext, useContext } from "react";

export interface AdminDetails {
  id: string;
  name: string;
  phone: string;
  profilePic: string;
}

export interface AdminContextType {
  adminDetails: AdminDetails;
  updateAdminDetails: (updates: Partial<AdminDetails>) => void;
}

// Define the context
export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);

// Custom hook to use the context
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
