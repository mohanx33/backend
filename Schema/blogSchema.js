const mongoose = require("mongoose");

const blogSchemaDb = mongoose.Schema({
  blogHeading: {
    type: String,
    required: true,
  },
  blogBody: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Blog = mongoose.model("Blog", blogSchemaDb);
module.exports = Blog;
