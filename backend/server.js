const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   HTTP SERVER + SOCKET.IO
======================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

/* =======================
   SOCKET CONNECTION
======================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =======================
   MAKE IO AVAILABLE GLOBALLY
======================= */
app.set("io", io);

/* =======================
   ROUTES (FIXED CLEAN VERSION)
======================= */

// AUTH ROUTES (ONLY ONE - FIXED)
app.use("/api/auth", require("./routes/authRoutes"));

// LEAVE ROUTES
app.use("/api/leave", require("./routes/leaveRoutes"));

// EMPLOYEE ROUTES
app.use("/api/employees", require("./routes/employeeRoutes"));

// ATTENDANCE ROUTES
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// NOTIFICATIONS ROUTES
app.use("/api/notifications", require("./routes/notificationRoutes"));

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`HR SaaS v4 running on port ${PORT}`);
});