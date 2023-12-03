const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();

const HttpError = require("./models/http-error");

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(helmet());

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

app.use(express.static(path.join(__dirname, "..", "build")));

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/message", messageRoutes);

app.get("/*", (req, res) => {
  console.log("Found a request from frontend...");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occurred!" });
  next(err);
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Backend server is running...");
  app.listen(process.env.PORT);
});
