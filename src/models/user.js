const mongoose = require("mongoose");

export const UserSchema = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  })
);
