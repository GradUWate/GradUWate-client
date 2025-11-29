// src/routes/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to Home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Welcome to GradUWate</h1>
        <p className="text-gray-600 mb-6">
          Please sign in to access your schedule.
        </p>

        <button
          onClick={signIn}
          className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
