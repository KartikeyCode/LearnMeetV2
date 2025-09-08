import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- Import the useAuth hook
import { supabase } from "../supabaseClient";

function Navbar() {
  const { user } = useAuth(); // Get the user from the context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Navigate to home after logout
  };

  // Extract the username part from the email
  const username = user?.email?.split("@")[0];

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          LearnMeet
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            // If the user is logged in, show welcome message and logout button
            <>
              <span className="text-gray-300">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // If the user is not logged in, show the Login button
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
