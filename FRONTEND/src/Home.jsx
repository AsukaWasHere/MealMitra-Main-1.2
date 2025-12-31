import React from "react";
import { useNavigate } from "react-router-dom";
import FoodMap from "./components/FoodMap";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-start">
      <section className="text-center px-4 sm:px-6 w-full max-w-2xl lg:max-w-3xl mb-12 sm:mb-16 pt-12 sm:pt-16">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
          Welcome to MealMitra
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-md mx-auto font-medium">
          Connect with your community by sharing food and meals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/login")}
            className="border-2 border-green-600 text-green-700 px-8 py-3.5 rounded-full hover:bg-green-100 hover:shadow-lg transition-all duration-300 font-bold text-lg transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/userchoice")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-full hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all duration-300 font-bold text-lg shadow-md transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={() => navigate("/Getchoice")}
          className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-10 py-5 rounded-full hover:from-lime-600 hover:to-green-700 hover:shadow-2xl transition-all duration-300 font-bold text-xl tracking-wide shadow-lg transform hover:scale-110"
        >
          Get Started
        </button>
      </section>

      <div className="w-full bg-gradient-to-b from-white to-green-50/50 py-12 sm:py-16 flex justify-center">
        <section className="w-full max-w-4xl px-4 sm:px-6 flex flex-col lg:flex-row items-start lg:space-x-8">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2 lg:hidden">Live View of Current Donations</h2>
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-green-100"
              style={{ paddingTop: '56.25%' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <FoodMap />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 pt-4">
            <h2 className="hidden lg:block text-3xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4 border-b-2 pb-3 border-green-300">
              Live View of Current Donations
            </h2>
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              Explore the real-time food sharing activity happening right now in your community.
            </p>
          </div>
        </section>
      </div>
      <footer className="w-full bg-gradient-to-r from-green-800 to-emerald-800 text-white text-center text-sm py-6 border-t-2 border-green-600">
        <p className="font-semibold">Discover fresh, local meals and reduce food waste. Join the MealMitra movement!</p>
      </footer>
    </div>
  );
}