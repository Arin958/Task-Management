const User = require("../models/User");
const Company = require("../models/Company");
const { createJWT } = require("../utils/index");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new user (requires companyId)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyId, jobTitle } = req.body;

    // PREVENT superadmin registration through public route
    if (role === "superadmin") {
      return res.status(403).json({ 
        message: "Cannot register as superadmin through this route" 
      });
    }

    // CompanyId is required for all non-superadmin roles
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    // Validate company exists and is active
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message: "Company not found" });
    }
    if (!company.isActive) {
      return res.status(400).json({ message: "Company is not active" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role - only allow employee, manager, admin roles for registration
    const allowedRoles = ["employee", "manager", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Allowed roles: employee, manager, admin" 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      companyId,
      jobTitle,
      isActive: true
    });

    // Create JWT and set cookie
    createJWT(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      jobTitle: user.jobTitle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: "Account has been deactivated" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create JWT and set cookie
      createJWT(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        jobTitle: user.jobTitle,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.jobTitle = req.body.jobTitle || user.jobTitle;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // Create new JWT if password was changed
      if (req.body.password) {
        createJWT(res, updatedUser._id);
      }

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyId: updatedUser.companyId,
        jobTitle: updatedUser.jobTitle,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const checkCookies = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
  checkCookies
};