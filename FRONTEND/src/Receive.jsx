import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Receive() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [quantity, setQuantity] = useState("");

  const foodTypes = [
    "Prepared",
    "Fresh Produce",
    "Packaged Food",
    "Dairy",
    "Beverages",
  ];

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Selected food types:", selectedTypes);
  console.log("Quantity for people:", quantity);
  navigate("/Receiveresults");
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-green-50 p-6 overflow-hidden">
      {/* Background Image */}
      <img
        src="/bg101.jpg"
        alt="India Map"
        className="absolute right-0 top-0 h-full w-full object-cover opacity-10 brightness-50 pointer-events-none"
      />

      {/* Dark overlay to tone down background */}
      <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>

      {/* Content Card */}
      <div className="relative z-10 bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Find Food Donations
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Food Type Checkboxes */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-700 font-semibold">Select Food Types:</span>
            {foodTypes.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>

          {/* Quantity Input */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">
              Number of People:
            </label>
            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Search Food
          </button>
        </form>
      </div>
    </div>
  );
}
