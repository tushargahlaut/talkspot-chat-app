const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    pic: {
      type: String,
      default:
        "https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",userSchema);

module.exports = User;