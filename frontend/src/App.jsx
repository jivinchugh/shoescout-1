import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TestComponent from "./components/testComponent";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import Profile from "./components/auth/Profile";
import ShoeSizeForm from "./components/ShoeSizeForm"; // Import the new component
import LandingPage from "./components/LandingPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [loadingTooLong, setLoadingTooLong] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadingTooLong(true);
      }
    }, 5000); // Show message after 5 seconds

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white-100">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
          {loadingTooLong && (
            <p className="text-sm text-white-500 mt-2">
              This is taking longer than expected. Please check your internet connection.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 p-4 w-full">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-6">
    
        {!isAuthenticated ?  <LandingPage /> :  <Profile />}
        <footer className="border-t w-full py-4">
        <div className=" flex items-center justify-between px-4 md:px-6">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Capstone Store</p>
        </div>
      </footer>
      </div>

      {/* Add the ShoeSizeForm component when user is authenticated */}
      {isAuthenticated && (
        <div className="w-full max-w-md">
          <ShoeSizeForm />
        </div>
      )}
      
    </div>
    
  );
}

export default App;