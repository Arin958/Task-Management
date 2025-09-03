const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoutes = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "_id role email companyId"
      );
      req.user = {
        role: resp.role,
        email: resp.email,
        _id: resp._id,
        companyId: resp.companyId,
      };

      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

const isAdminRoute = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to access this route" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

module.exports = { protectRoutes, isAdminRoute };
