const jwt = require("jsonwebtoken");

exports.createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    expires: new Date(
      Date.now() +  24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
};
