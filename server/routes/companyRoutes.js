const express = require("express");
const {
  registerCompany,
  getCompanyDetails,
} = require("../controllers/companyController");

const companyRoutes = express.Router();

companyRoutes.get("/:id", getCompanyDetails);
companyRoutes.post("/register/company", registerCompany);

module.exports = companyRoutes;
