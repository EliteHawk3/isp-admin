import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import PackagesPage from "./pages/PackagesPage";
import PaymentsPage from "./pages/PaymentsPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotifcationsPage";
import AppProviders from "./context/AppProviders";
import SettingsPage from "./pages/SettingsPage";

const ProtectedRoute = ({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: React.ReactNode;
}) => {
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [tempProfilePic, setTempProfilePic] = useState<string | null>(null); // Manage temp profile picture state

  useEffect(() => {
    // Sync state with localStorage if login state changes
    const storedLoginState = localStorage.getItem("isLoggedIn") === "true";
    if (storedLoginState !== isLoggedIn) {
      setIsLoggedIn(storedLoginState);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AppProviders>
      <Router>
        <div className="h-screen bg-gray-950 flex">
          {/* Conditional Sidebar */}
          {isLoggedIn && (
            <Sidebar
              onLogout={handleLogout}
              tempProfilePic={tempProfilePic} // Pass tempProfilePic to Sidebar
            />
          )}

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto bg-gray-950">
            <Routes>
              {/* Login Route */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginPage onLogin={handleLogin} />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/packages"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <PackagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <SettingsPage setTempProfilePic={setTempProfilePic} />{" "}
                    {/* Pass state setter */}
                  </ProtectedRoute>
                }
              />
              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <div className="text-white text-center">
                    404 - Page Not Found
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProviders>
  );
};

export default App;
