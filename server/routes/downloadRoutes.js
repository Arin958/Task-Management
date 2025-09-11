const express = require("express");
const { protectRoutes } = require("../middleware/authMiddleware");
const { download } = require("../controllers/downloadController");

const downloadRoutes = express.Router();

downloadRoutes.get("/", protectRoutes, download);

module.exports = downloadRoutes;
