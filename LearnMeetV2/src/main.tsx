import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Define the routes for your application
// Create the router configuration with separate routes for each page
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // The root path will render the Home component
  },
  {
    path: "/login",
    element: <Login />, // The /login path will render the Login component
  },
  {
    path: "/register",
    element: <Register />, // The /register path will render the Register component
  },
  {
    // The game route, which will not have the Navbar
    path: "/game",
    element: (
      <ProtectedRoute>
        <Game />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
