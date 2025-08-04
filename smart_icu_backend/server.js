require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/databse"); // Database connection
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

// Routes for API
const unauthRoutes = require("./src/routes/Routes");
const ecgRoutes = require("./src/routes/SensorDataRoutes/ecgRoutes");
const medicalHistory = require("./src/routes/medicalHistory/HistoryRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" })); // React frontend
app.use(morgan("dev"));
// Use cookie parser middleware
app.use(cookieParser());

// Connect to MongoDB
connectDB();
console.log("🔗 Trying to establish a connection to MongoDB");

let wsInitialized = false; // Track WebSocket initialization

io.on("connection", (socket) => {
  console.log(`⚡ WebSocket Connected: ${socket.id}`);
  wsInitialized = true; // Mark WebSocket as initialized

  socket.on("disconnect", () => {
    console.log("🚪 User disconnected");
  });
});

// Use routes
app.use("/api/not-auth", unauthRoutes);
app.use("/api", ecgRoutes(io)); // Pass io to routes
app.use("/api", medicalHistory);

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Log WebSocket status periodically to check if it's still connected
setInterval(() => {
  console.log(
    wsInitialized
      ? "✅ WebSocket is initialized"
      : "⚠️ WebSocket not initialized"
  );
}, 5000);
