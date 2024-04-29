const express = require("express");
const {
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const verifyUser = require("../middlewire/verifyUser");
const verifyAdmin = require("../middlewire/verifyAdmin");
const logMiddleware = require("../middlewire/log");

const router = express.Router();

// Apply logging middleware to log all routes
router.use(logMiddleware);

//User Register Route
router.post(
  "/register",
  // upload.single("avatar"),
  registerUser
);

//User Login Route
router.post("/login", loginUser);

//User Update Route
router.put("/update-user", verifyUser, updateUser);

//delete user
router.delete("/delete-user/:id", verifyAdmin, deleteUser);

module.exports = router;
