import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center py-4">Not authenticated</div>;
  }

  return (
    <div className="text-center p-4 bg-white shadow rounded">
      <img
        src={user.picture}
        alt={user.name}
        className="rounded-full mx-auto mb-2"
      />
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default Profile;