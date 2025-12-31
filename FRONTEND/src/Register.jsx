import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./context/AuthContext";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("type") || "donor";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: userType,
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(fd => ({ ...fd, role: userType }));
  }, [userType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/auth/signup", formData);
      login(response.data.token);
      navigate("/getchoice");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center border-2 border-lime-100">
        <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
          Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </h2>
        <p className="text-gray-600 mb-8">Join the MealMitra community</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-lg" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-lg" required />
          
          {userType === 'receiver' && (
            <>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-lg" required />
              <input type="text" name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-lg" required />
            </>
          )}

          {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3"><p className="text-red-600 text-sm font-medium">{error}</p></div>}
          <button type="submit" className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold py-3.5 rounded-xl hover:from-lime-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg">
            Create Account
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
                Already have an account? 
                <Link to="/login" className="text-green-600 font-semibold hover:text-green-800 ml-1 transition-colors">
                    Sign In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;