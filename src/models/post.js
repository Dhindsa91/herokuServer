const mongoose = require("mongoose");

export const PostSchema = mongoose.model(
  "Post",
  new mongoose.Schema({
    description: {
      type: String,
    },
    username: {
      type: String,
      required: true
    },
    dueDate: {
      type: String,
      default:''    
    },
    status: {
      type: String,
      default: ''
    },
  })
);
