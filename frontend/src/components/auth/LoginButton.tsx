import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="group flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px]"
    >
      Log In
    </button>
  );
};

export default LoginButton;