const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Hashing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//create token
userSchema.methods.createToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
