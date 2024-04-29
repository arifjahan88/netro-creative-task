const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const Users = require("../models/userModel");
const { createError } = require("../utils/error");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  try {
    //Get token from header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    //Check if token is provided
    if (!token) {
      throw createError(401, "You are not Authenticate!");
    }

    //Check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Check if user is existed
    const userinfo = await Users.findById(decoded._id).select("-password");
    if (!userinfo) {
      throw createError(404, "Invalid Access Token!");
    }

    //Check if user is admin
    if (!userinfo.isAdmin) {
      throw createError(403, "You are not allowed to access this!");
    }

    //Set user info to req.user
    req.user = userinfo;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = verifyAdmin;
