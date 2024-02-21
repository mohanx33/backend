const express = require("express");
const multer = require("multer");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/auth");

const route = express.Router();
const upload = multer({ dest: "uploads/" });

route.post("/addUser", userController.addUser);
route.post("/login", userController.login);
route.get("/getAllUser", authMiddleware, userController.getAllUser);
route.get("/getUserById/:id", authMiddleware, userController.getUserById);

module.exports = route;
