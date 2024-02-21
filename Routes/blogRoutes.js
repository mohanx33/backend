const express = require("express");
const blogController = require("../controller/blogController");
const route = express.Router();
const authMiddleware = require("../middleware/auth");

route.post("/addBlog", authMiddleware, blogController.addBlog);
route.get("/getAllBlog", blogController.getAllBlog);
route.get("/getBlogById/:id", authMiddleware, blogController.getBlogById);
route.get(
  "/getAllBlogByAuthor/:id",
  authMiddleware,
  blogController.getAllBlogByAuthorId
);
route.put("/updateBlog/:id", authMiddleware, blogController.updateBlog);

module.exports = route;
