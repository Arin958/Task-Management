const Company = require("../models/Company");
const User = require("../models/User");
const { createJWT } = require("../utils");
// @desc    Register a new company with admin user
// @route   POST /api/auth/register-company


// @access  Public
exports.registerCompany = async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      address, 
      adminName, 
      adminEmail, 
      adminPassword, 
      adminJobTitle 
    } = req.body;

    // Check if admin email already exists
    const userExists = await User.findOne({ email: adminEmail });
    if (userExists) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    // 1. Create Company (without admins field since your schema doesn't have it)
    const company = await Company.create({
      name: companyName,
      industry,
      address,
      isActive: true
    });

    // 2. Create Admin User for this company
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      companyId: company._id,
      jobTitle: adminJobTitle || 'Administrator',
      isActive: true
    });

    // 3. Login the admin
    createJWT(res, adminUser._id);

    res.status(201).json({
      message: "Company and admin user created successfully",
      company: {
        _id: company._id,
        name: company.name,
        industry: company.industry
      },
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        companyId: adminUser.companyId
      }
    });
  } catch (error) {
    // Handle duplicate company names
    if (error.code === 11000) {
      return res.status(400).json({ message: "Company name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};


exports.getCompanyDetails = async(req,res) => {
  try{
    const company = await Company.findById(req.params.id);
    if(!company){
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}