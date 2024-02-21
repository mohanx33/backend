const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  profilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
