const express = require("express");
const invitationRoutes = express.Router();
const {
  generateInvitationLink,
  validateInvitationToken,
  registerWithInvitation,
  getCompanyInvitations,
  revokeInvitation
} = require("../controllers/invitationController");
const { protectRoutes, isAdminRoute } = require("../middleware/authMiddleware");

invitationRoutes.post("/generate", protectRoutes, isAdminRoute, generateInvitationLink);
invitationRoutes.get("/validate/:token", validateInvitationToken);
invitationRoutes.post("/register", registerWithInvitation);
invitationRoutes.get("/company/:companyId", protectRoutes, isAdminRoute, getCompanyInvitations);
invitationRoutes.put("/revoke/:id", protectRoutes, isAdminRoute, revokeInvitation);

module.exports = invitationRoutes;