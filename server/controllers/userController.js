const User = require("../models/User");
const Company = require("../models/Company");

// @desc    Get all users for a company
// @route   GET /api/users
// @access  Private (Admin/Manager within company)
const getUsers = async (req, res) => {
  try {
    // Superadmin can see all users, others only see users in their company
    const filter = req.user.role === "superadmin" 
      ? {} 
      : { companyId: req.user.companyId };

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin/Manager within company or own profile)
const getUserById = async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization check
    if (req.user.role !== "superadmin" && 
        user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user (by admin)
// @route   POST /api/users
// @access  Private (Admin within company)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, jobTitle } = req.body;

    // Authorization check - only admin can create users in their company
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Not authorized to create users" });
    }

    // For non-superadmin, users must be created in the same company
    const companyId = req.user.role === "superadmin" 
      ? req.body.companyId 
      : req.user.companyId;

    if (!companyId && req.user.role !== "superadmin") {
      return res.status(400).json({ message: "Company ID is required" });
    }

    // Validate company exists if provided
    if (companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(400).json({ message: "Company not found" });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      companyId,
      jobTitle,
    });

    // Add to company's admin list if role is admin
    if (role === "admin" && companyId) {
      await Company.findByIdAndUpdate(
        companyId,
        { $addToSet: { admins: user._id } },
        { new: true }
      );
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      jobTitle: user.jobTitle,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin within company)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization check
    if (req.user.role !== "superadmin" && 
        user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only admin can update roles
    if (req.body.role && req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Not authorized to change roles" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.jobTitle = req.body.jobTitle || user.jobTitle;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Update company admin list if role changed
    if (req.body.role && user.companyId) {
      const company = await Company.findById(user.companyId);
      if (req.body.role === "admin") {
        await Company.findByIdAndUpdate(
          user.companyId,
          { $addToSet: { admins: user._id } },
          { new: true }
        );
      } else if (user.role === "admin" && req.body.role !== "admin") {
        await Company.findByIdAndUpdate(
          user.companyId,
          { $pull: { admins: user._id } },
          { new: true }
        );
      }
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      companyId: updatedUser.companyId,
      jobTitle: updatedUser.jobTitle,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin within company)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization check
    if (req.user.role !== "superadmin" && 
        user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    // Remove from company admin list if applicable
    if (user.role === "admin" && user.companyId) {
      await Company.findByIdAndUpdate(
        user.companyId,
        { $pull: { admins: user._id } },
        { new: true }
      );
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};