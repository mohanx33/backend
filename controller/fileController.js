const mongoose = require("mongoose");
const File = require("../Schema/fileSchema");
const User = require("../Schema/userSchema");
const { json } = require("express");

exports.uploadFile = async (req, res) => {
  try {
    const { uploadedById } = req.body;
    const { filename, path } = req.file;

    const imageUrl = `http://localhost:8080/${path.replace(/\\/g, "/")}`;

    const file = new File({
      filename,
      path: imageUrl,
      // uploadedBy: JSON.stringify(userData),
      // uploadedById,
    });

    const savedFile = await file.save();
    return res.status(200).json(savedFile);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
