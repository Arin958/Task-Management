const express = require("express");
const { getUsers, getUserById } = require("../controllers/userController");
const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware");
const userRoutes = express.Router();

userRoutes.get("/get-users",protectRoutes, getUsers);
userRoutes.get("/get-users/:id",protectRoutes, getUserById);


module.exports = userRoutes