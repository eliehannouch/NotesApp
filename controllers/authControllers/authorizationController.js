const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../../models/userModel");

exports.protectRoutes = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in - Please log in to get access",
      });
    }

    // 2) token verification
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token. Please log in" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your session token has expired !! Please login again",
        });
      }
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token does no longer exist.",
      });
    }

    req.user = currentUser;

    next();
  } catch (err) {
    console.log(err);
  }
};
