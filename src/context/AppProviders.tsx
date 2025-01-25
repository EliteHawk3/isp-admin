// src/context/AppProviders.tsx
import { ReactNode } from "react";
import UsersProvider from "./UsersProvider";
import PackagesProvider from "./PackagesProvider";
import SynchronizationComponent from "./SynchronizationComponent";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <UsersProvider>
      <PackagesProvider>
        <SynchronizationComponent /> {/* Handles synchronization */}
        {children}
      </PackagesProvider>
    </UsersProvider>
  );
};

export default AppProviders;
