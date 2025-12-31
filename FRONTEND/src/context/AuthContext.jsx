import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    let socket;
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Establish socket connection for logged-in user
        socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5001");
        
        // Register user with the socket server
        socket.emit("registerUser", decodedUser.id);

        // Listen for claim notifications
        socket.on("listingClaimed", (notification) => {
          alert(
            `🎉 Your listing has been claimed!\n\n` +
            `Item: ${notification.listingTitle}\n` +
            `Claimed by: ${notification.receiverName}\n\n` +
            `Please contact them to arrange pickup:\n` +
            `Phone: ${notification.receiverPhone}\n` +
            `Address: ${notification.receiverAddress}`
          );
        });

      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }

    // Cleanup function to disconnect socket when component unmounts or token changes
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;