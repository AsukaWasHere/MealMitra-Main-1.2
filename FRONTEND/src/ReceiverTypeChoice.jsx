import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReceiverTypeChoice() {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    // Navigate to the results page, passing the user type in the state
    navigate("/receiveresults", { state: { userType: type } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-lime-100 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-lg border-t-4 border-green-500">
        <h2 className="text-3xl font-extrabold mb-8 text-green-800">
          How are you receiving?
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Individual Card */}
          <div
            onClick={() => handleSelection("individual")}
            className="flex-1 p-6 bg-lime-50 rounded-2xl shadow-md cursor-pointer hover:shadow-xl hover:bg-lime-100 transform hover:-translate-y-1 transition duration-300 border-2 border-lime-200"
          >
            <h3 className="text-2xl font-bold text-lime-700 mb-2">Individual</h3>
            <p className="text-sm text-gray-600">
              I am collecting food for myself or my family.
            </p>
          </div>

          {/* NGO/Charity Card */}
          <div
            onClick={() => handleSelection("ngo")}
            className="flex-1 p-6 bg-green-50 rounded-2xl shadow-md cursor-pointer hover:shadow-xl hover:bg-green-100 transform hover:-translate-y-1 transition duration-300 border-2 border-green-200"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              NGO / Charity
            </h3>
            <p className="text-sm text-gray-600">
              I am collecting on behalf of an organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}