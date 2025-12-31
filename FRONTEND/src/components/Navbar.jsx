import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/api/auth/me");
      if (response.data.success) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white shadow-2xl border-b-2 border-green-600">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
          MealMitra
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm">Home</Link>
          <Link to="/about" className="px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm">About</Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Hello, {userInfo?.name || "User"}</span>
              </Link>
              <Link to="/cart" className="px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm">Cart</Link>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm">Login</Link>
              <Link to="/userchoice" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}