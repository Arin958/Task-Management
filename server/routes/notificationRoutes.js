const express = require("express");
const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware");
const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require("../controllers/notificationController");

const notificationRoutes = express.Router();

notificationRoutes.get("/", protectRoutes, getNotifications);
notificationRoutes.patch("/:id/read", protectRoutes, markNotificationAsRead);
notificationRoutes.patch("/read-all", protectRoutes, markAllNotificationsAsRead)

module.exports = notificationRoutes;