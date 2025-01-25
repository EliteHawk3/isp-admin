import React, { useState } from "react";

type LoginPageProps = {
  onLogin: () => void; // Function prop to handle successful login
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hardcoded credentials for demo purposes
  const correctCredentials = {
    username: "admin",
    password: "admin123",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for empty fields
    if (!username || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Authentication Logic
    if (username === correctCredentials.username && password === correctCredentials.password) {
      setErrorMessage(""); // Clear error message
      onLogin(); // Call the onLogin prop to notify the parent component
    } else {
      setErrorMessage("Invalid username or password."); // Display error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 text-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 text-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-600 text-white p-3 rounded-md text-center">
              {errorMessage}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 rounded-md"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-gray-400 text-sm text-center">
          © 2025 ISP Admin. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
