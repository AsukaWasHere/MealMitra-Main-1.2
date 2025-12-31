import React from "react";
import { useNavigate } from "react-router-dom";

export default function Userchoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-green-900">
          Register as:
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/register?type=donor")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Donor
          </button>
          <button
            onClick={() => navigate("/register?type=receiver")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Receiver
          </button>
        </div>
      </div>
    </div>
  );
}
