import React, { ReactNode, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If there is no user, open the modal.
    if (!user) {
      setIsModalOpen(true);
    }
  }, [user]);

  // If there is a user, render the children (the protected page).
  if (user) {
    return <>{children}</>;
  }

  // If there is no user, render the modal.
  return (
    <Modal isOpen={isModalOpen} onClose={() => navigate(-1)}>
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">You must be logged in to access the game.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate(-1)} // Navigates back to the previous page
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProtectedRoute;
