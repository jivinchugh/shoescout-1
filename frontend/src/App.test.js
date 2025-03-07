import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { useAuth0 } from "@auth0/auth0-react";

// Mock the Auth0 hook
jest.mock("@auth0/auth0-react");

test("renders Auth0 Demo heading when not loading", () => {
  // Mock the Auth0 hook return values
  useAuth0.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  });

  render(<App />);
  const headingElement = screen.getByText(/Auth0 Demo/i);
  expect(headingElement).toBeInTheDocument();
});

test("renders loading message when Auth0 is loading", () => {
  // Mock the Auth0 hook return values for loading state
  useAuth0.mockReturnValue({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  render(<App />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});