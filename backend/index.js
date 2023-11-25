const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

const HttpError = require("./models/http-error");

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(morgan("common"));
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT"
  );
  next();
});

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/message", messageRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Couldn't find this route.", 404);
  next(error);
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
