const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const blogRouters = require("./Routes/blogRoutes");
const userRouters = require("./Routes/userRoute");
const fileRouters = require("./Routes/fileRouter");
const cors = require("cors");

const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@recruit.kriyklb.mongodb.net/`
  )
  .then((res) => {
    console.log("Mongoose Connected Successfully");
  })
  .catch((err) => {
    throw new Error(`Mongoose Error : ${err}`);
  });

app.use("/blog", blogRouters);
app.use("/user", userRouters);
app.use("/uploadFiles", fileRouters);
app.get("/hello", (req, res) => {
  return res.status(200).json("Helloo From world");
});

app.listen(process.env.APP_PORT, async () => {
  console.log(
    `App is listening to port http://localhost:${process.env.APP_PORT}`
  );
});
