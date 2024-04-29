const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const Users = require("../models/userModel");
const { createError } = require("../utils/error");

const verifyUser = asyncHandler(async (req, res, next) => {
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

    //Set user info to req.user
    req.user = userinfo;

    // Allow only if the requested user is the same as the authenticated user
    if (req.params.id && req.params.id !== userinfo._id.toString()) {
      throw createError(403, "You are not authorized to access this resource!");
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = verifyUser;
