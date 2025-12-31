import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/auth/login", formData);
      login(response.data.token);
      navigate("/getchoice");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center border-2 border-green-100">
        <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Sign In
        </h2>
        <p className="text-gray-600 mb-8">Welcome back to MealMitra</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg" required />
          {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3"><p className="text-red-600 text-sm font-medium">{error}</p></div>}
          <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg">
            Access Account
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
                New to MealMitra? 
                <Link to="/userchoice" className="text-green-600 font-semibold hover:text-green-800 ml-1 transition-colors">
                    Create an Account
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;