const Users = require("../models/userModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { createError } = require("../utils/error");

//Add User part
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password, address, phone } = req.body;

  //Check if all fields are provided
  if ([username, email, fullname, password, address, phone].some((field) => field?.trim() === "")) {
    throw createError(400, "All fields are required");
  }

  //Check if user already existed
  const existedUser = await Users.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw createError(400, "User with email or username already existed");
  }

  //Create new user
  const user = await Users.create({
    username,
    email,
    fullname,
    password,
    address,
    phone,
    // avatar: req.file?.filename,
  });

  //check if user is created
  const createdUser = await Users.findById(user._id).select("-password");
  if (!createdUser) {
    throw createError(500, "User not created");
  }

  //Send response
  res.status(200).json({
    message: "User Registered Successfully!",
    success: true,
    data: createdUser,
  });
});

//User login part
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check if email are provided
  if (!email) {
    throw createError(400, "Email is required");
  }

  //Check user existed or not
  const user = await Users.findOne({ email });
  if (!user) {
    throw createError(404, "User does not exist");
  }

  const validpass = await user.isPasswordCorrect(password);
  if (!validpass) {
    throw createError(401, "Invalid Password");
  }

  //Create token
  const accessToken = user.createToken();
  const userWithoutPassword = { ...user._doc, password };

  //Set cookie options
  const options = {
    secure: true,
    httpOnly: true,
  };

  //N:B -> Here I use coocke to store the token but you can use localstorage or sessionstorage to store the token and if there are made a app then you can use asyncstorage to store the token
  //Send response
  res.status(200).cookie("accessToken", accessToken, options).json({
    message: "User Login Successfull!",
    success: true,
    data: userWithoutPassword,
    accessToken,
  });
});

//user update part
exports.updateUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  // Find the user by ID
  const user = await Users.findById(req.user._id);

  // Check if user exists
  if (!user) {
    throw createError(404, "User not found");
  }

  // Update user fields if provided
  user.username = username || user.username;
  user.email = email || user.email;
  user.fullname = fullname || user.fullname;
  user.password = password || user.password;

  // Save the updated user
  await user.save();

  //Send response
  res.status(200).json({
    message: "User Updated Successfully!",
    success: true,
    data: user,
  });
});

//user delete part
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Find the user by ID
  const user = await Users.findById(id);

  // Check if user exists
  if (!user) {
    throw createError(404, "User not found");
  }

  // Delete the user
  await Users.deleteOne({ _id: user._id });

  //Send response
  res.status(200).json({
    message: "User Deleted Successfully!",
    success: true,
  });
});
