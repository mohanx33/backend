const mongoose = require("mongoose");
const User = require("../Schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Upload = require("../Schema/fileSchema");

exports.addUser = async (req, res) => {
  const { password, email, username, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same username already exists" });
    }
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(400)
        .json({ error: "User with the same email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      profilePicture: profilePicture,
      password: hashedPassword,
      email: email,
      username: username,
    });

    const savedUser = await userData.save();

    return res.status(200).json({
      id: savedUser.id,
      profilePicture: savedUser.profilePicture,
      email: savedUser.email,
      username: savedUser.username,
    });
  } catch (error) {
    console.error("Error Adding User", error);
    res.status(500).send(`Error Adding User.${error}`);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User Not Found Please Regsiter");
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(500).json("Wrong Password");
    }
    const token = jwt.sign({ user_id: user.id }, "MY_SERVER_SECRET", {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ access_token: `Bearer ${token}`, user_id: user.id });
  } catch (error) {
    console.error("Login Error", error);
    return res.status(500).send(`Login Error.${error}`);
  }
};

exports.getAllUser = (req, res) => {
  User.find()
    .then((data) => {
      if (!data) {
        return res.status(400).json({ error: "No User Data Found" });
      }
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.error("Error ", error);
      res.status(500).send(`Error .${error}`);
    });
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, username, email, profilePicture } = user;
    let profilepictureUrl = null;

    if (profilePicture) {
      const upload = await Upload.findById(profilePicture);
      if (upload) {
        console.log(upload, "jj");
        profilepictureUrl = upload.path; // Assuming the field containing the file path is 'filePath'
      }
    }

    res.status(200).json({
      id: _id,
      username,
      profilepicture: profilePicture,
      email,
      profilepictureUrl,
    });
  } catch (error) {
    console.error("Error ", error);
    res.status(500).json({ error: `Error getting User: ${error.message}` });
  }
};
