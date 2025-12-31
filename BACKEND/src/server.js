// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

// Import API route handlers
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import errorHandler from "./middleware/errorHandler.js"; // Import the error handler

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"],
  },
});

// This map tracks which socket belongs to which logged-in user
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // When a user logs in, they can register their user ID with their socket ID
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`📡 User ${userId} registered with socket ${socket.id}`);
  });

  // When a user disconnects, remove them from the online users map
  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`🔌 User ${key} disconnected and was unregistered.`);
        break;
      }
    }
    console.log("❌ User disconnected:", socket.id);
  });
});

// Export 'io' and 'onlineUsers' so controllers can use them
export { io, onlineUsers };

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
// All data logic (creating, claiming) is handled by these routes, not by socket events.
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// Use the centralized error handler
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5001; // Use 5001 as we discussed
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));