import { ReactNode } from "react";
import UsersProvider from "./UsersProvider";
import PackagesProvider from "./PackagesProvider";
import NotificationsProvider from "./NotificationsProvider";
import SynchronizationComponent from "./SynchronizationComponent";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <PackagesProvider>
        <NotificationsProvider>
          <SynchronizationComponent />
          {children}
        </NotificationsProvider>
      </PackagesProvider>
    </UsersProvider>
  );
};

export default AppProviders;
