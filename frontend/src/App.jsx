import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import Profile from "./components/auth/Profile";
import ShoeSizeForm from "./components/ShoeSizeForm";
import ShoeSearch from "./components/ShoeSearch";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Auth0 Demo</h1>

        <div className="flex justify-center space-x-4 mb-6">
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>

        {isAuthenticated && <Profile />}
      </div>

      {/* Add the ShoeSizeForm component when user is authenticated */}
      {isAuthenticated && (
        <div className="w-full max-w-md">
          <ShoeSizeForm />
        </div>
      )}

      {/* Add the ShoeSearch component when user is authenticated */}
      {isAuthenticated && (
        <div className="w-full max-w-md mt-6">
          <ShoeSearch />
        </div>
      )}
    </div>
  );
}

export default App;