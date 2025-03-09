import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TestComponent from "./components/testComponent";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import Profile from "./components/auth/Profile";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Auth0 Demo</h1>

        <div className="flex justify-center space-x-4 mb-6">
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>

        {isAuthenticated && <Profile />}
      </div>

      <TestComponent />
    </div>
  );
}

export default App;