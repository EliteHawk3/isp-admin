// src/context/AppProviders.tsx
import { ReactNode } from "react";
import AdminProvider from "./AdminProvider";
import UsersProvider from "./UsersProvider";
import PackagesProvider from "./PackagesProvider";
import NotificationsProvider from "./NotificationsProvider";
import SynchronizationComponent from "./SynchronizationComponent";
import { TasksProvider } from "./TasksProvider";
const AppProviders = ({ children }: { children: ReactNode }) => (
  <AdminProvider>
    <UsersProvider>
      <PackagesProvider>
        <NotificationsProvider>
          <TasksProvider>
            <SynchronizationComponent />
            {children}
          </TasksProvider>
        </NotificationsProvider>
      </PackagesProvider>
    </UsersProvider>
  </AdminProvider>
);

export default AppProviders;
