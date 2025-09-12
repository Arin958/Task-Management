const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const companyRoutes = require("./routes/companyRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const testRoutes = require("./routes/testROutes");

const app = express();

// Shared CORS origin checker
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

const isOriginAllowed = (origin) => {
  return (
    !origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)
  );
};

// CORS for Express
app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));



// API routes

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/download", downloadRoutes)
app.use("/api/test", testRoutes)



// Connect MongoDB
connectDB();

// Socket.IO authentication middleware

// In-memory user-socket map

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
