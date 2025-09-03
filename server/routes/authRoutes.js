const express = require("express");
const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getTeamList,
  getNotificationsList,
  updateUserProfile,
  markNotificationRead,
  changeUserPassword,
  activateUserProfile,
  logoutUser,
  deactivateUserProfile,
} = require("../controllers/authController");
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);

// authRoutes.get("/get-team", protectRoutes, isAdminRoute, getTeamList);
// authRoutes.get("/notifications", protectRoutes, getNotificationsList);

// authRoutes.put("/profile", protectRoutes, updateUserProfile);

// authRoutes.put("/read-notification", protectRoutes, markNotificationRead);
// authRoutes.put("/change-password", protectRoutes, changeUserPassword);

// authRoutes
//   .route("/:id")
//   .put(protectRoutes, isAdminRoute, activateUserProfile)
//   .delete(protectRoutes, isAdminRoute, deactivateUserProfile);

module.exports = authRoutes;
