const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  path: {
    type: String,
  },
  // uploadedBy: {
  //   type: String,
  // },
  // uploadedById: {
  //   type: mongoose.Schema.Types.ObjectId,
  // },
});
const File = mongoose.model("File", fileSchema);
module.exports = File;
