const express = require("express");
const multer = require("multer");
const path = require("path");
const fileController = require("../controller/fileController");

const route = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
route.post("/upload", upload.single("file"), fileController.uploadFile);
module.exports = route;
