const express = require("express");
const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware");
const { getBossDashboard, getEmployeeDashboard } = require("../controllers/dashboardController");

const dashboardRoutes = express.Router();

dashboardRoutes.get("/boss", protectRoutes, isAdminRoute, getBossDashboard);
dashboardRoutes.get("/employee", protectRoutes, getEmployeeDashboard);

module.exports = dashboardRoutes;

