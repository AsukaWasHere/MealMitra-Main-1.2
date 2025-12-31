import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FoodMap from "./components/FoodMap";

// Helper to geocode address using the OpenCage API
const geocode = async (address) => {
  const query = encodeURIComponent(address);
  const apiKey = 'e809430e7727472da5e0607b1a3ee3ec'; 
  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return [Number(lat), Number(lng)];
    }
    return null;
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
};

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order; 
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(true);

  useEffect(() => {
    const calculateRoute = async () => {
      if (order && order.address && order.items && order.items.length > 0) {
        setLoadingRoute(true);
        
        try {
          // --- COORDINATE FALLBACK LOGIC ---
          const DEFAULT_COORDS = [20.5937, 78.9629]; // Center of India

          // Try to geocode both locations
          const fetchedReceiverCoords = await geocode(order.address);
          const fetchedDonorCoords = await geocode(order.items[0].location);

          // Use fetched coords if available, otherwise fallback to default
          const receiverCoords = fetchedReceiverCoords || DEFAULT_COORDS;
          const donorCoords = fetchedDonorCoords || DEFAULT_COORDS;

          // Set the route (even if one is a fallback, the map will still render)
          setRoute([receiverCoords, donorCoords]);
          // ---------------------------------

        } catch (error) {
          console.error("Route calculation failed:", error);
        } finally {
          setLoadingRoute(false);
        }
      } else {
        setLoadingRoute(false);
      }
    };
    
    calculateRoute();
  }, [order]);

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Collection Confirmed!
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Thank you for helping reduce food waste. Your pickup route is displayed below.
        </p>

        {/* Route Visualization Map */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-inner mb-8 border-4 border-green-100">
          {loadingRoute ? (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <p className="text-green-600 font-medium animate-pulse">Calculating pickup route...</p>
            </div>
          ) : route ? (
            <FoodMap routePoints={route} />
          ) : (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500 italic">Please check your dashboard for route details.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition font-bold shadow-lg transform hover:scale-105"
          >
            View in Dashboard
          </Link>
          <Link
            to="/"
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition font-bold shadow-md transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}