import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import PackagesProvider from "./context/PackagesProvider"; // Import the provider
import { UsersProvider } from "./context/UsersProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PackagesProvider>
      <UsersProvider>
        <App />
      </UsersProvider>
    </PackagesProvider>
  </StrictMode>
);
