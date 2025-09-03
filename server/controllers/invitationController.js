const Invitation = require("../models/Invitation");
const User = require("../models/User");
const Company = require("../models/Company");
const crypto = require("crypto");
const { createJWT } = require("../utils");

// @desc    Generate an invitation link
// @route   POST /api/invitations/generate
// @access  Private (Admin only)
const generateInvitationLink = async (req, res) => {
    
  try {
    const { companyId, role, expiresIn } = req.body;
    const createdBy = req.user._id;

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user is admin of this company OR superadmin
    const user = await User.findById(createdBy);
if (user.role === "admin" && user.companyId.toString() !== companyId) {
  return res.status(403).json({
    message: "Admins can only generate invitations for their own company",
  });
} else if (user.role !== "admin" && user.role !== "superadmin") {
  return res.status(403).json({
    message: "Not authorized to generate invitations",
  });
}

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiration date (default 7 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expiresIn || 7));

    // Create invitation
    const invitation = await Invitation.create({
      token,
      companyId,
      role: role || "employee", // Default role
      createdBy,
      expiresAt: expirationDate,
      isUsed: false,
    });

    // Generate frontend invitation link
    const invitationLink = `${process.env.CLIENT_URL}/invite/${token}`;

    res.status(201).json({
      message: "Invitation link generated successfully",
      invitationLink,
      expiresAt: invitation.expiresAt,
      role: invitation.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate an invitation token
// @route   GET /api/invitations/validate/:token
// @access  Public
const validateInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token })
      .populate("companyId", "name")
      .populate("createdBy", "name");

    if (!invitation) {
      return res.status(404).json({ message: "Invalid invitation token" });
    }

    if (invitation.isUsed) {
      return res
        .status(400)
        .json({ message: "Invitation link has already been used" });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({ message: "Invitation link has expired" });
    }

    res.json({
      valid: true,
      company: invitation.companyId.name,
      role: invitation.role,
      createdBy: invitation.createdBy.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register user with invitation token
// @route   POST /api/invitations/register
// @access  Public
const registerWithInvitation = async (req, res) => {
  try {
    const { token, name, email, password, jobTitle } = req.body;

    // Validate invitation token
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return res.status(404).json({ message: "Invalid invitation token" });
    }

    if (invitation.isUsed) {
      return res
        .status(400)
        .json({ message: "Invitation link has already been used" });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({ message: "Invitation link has expired" });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists. Please login instead.",
      });
    }

    // Create user with the company and role from the invitation
    const user = await User.create({
      name,
      email,
      password,
      role: invitation.role,
      companyId: invitation.companyId,
      jobTitle,
      isActive: true,
    });

    // Mark invitation as used
    invitation.isUsed = true;
    invitation.usedBy = user._id;
    invitation.usedAt = new Date();
    await invitation.save();

    // Create JWT and set cookie
    createJWT(res, user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        jobTitle: user.jobTitle,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all invitations for a company
// @route   GET /api/invitations/company/:companyId
// @access  Private (Admin only)
const getCompanyInvitations = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user._id;

    // Check if user has access to this company's invitations
    const user = await User.findById(userId);
    if (user.companyId.toString() !== companyId && user.role !== "superadmin") {
      return res.status(403).json({
        message: "Not authorized to view invitations for this company",
      });
    }

    const invitations = await Invitation.find({ companyId })
      .populate("createdBy", "name")
      .populate("usedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke an invitation
// @route   PUT /api/invitations/revoke/:id
// @access  Private (Admin only)
const revokeInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Check if user has access to revoke this invitation
    const user = await User.findById(userId);
    if (
      user.companyId.toString() !== invitation.companyId.toString() &&
      user.role !== "superadmin"
    ) {
      return res.status(403).json({
        message: "Not authorized to revoke this invitation",
      });
    }

    if (invitation.isUsed) {
      return res
        .status(400)
        .json({ message: "Cannot revoke an already used invitation" });
    }

    invitation.expiresAt = new Date(); // Set expiration to now
    await invitation.save();

    res.json({ message: "Invitation revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateInvitationLink,
  validateInvitationToken,
  registerWithInvitation,
  getCompanyInvitations,
  revokeInvitation,
};
