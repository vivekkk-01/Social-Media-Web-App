const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

exports.postRegister = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  let error = validationResult(req);

  if (!error.isEmpty()) {
    error = new HttpError(error.array()[0].msg, 422);
    return next(error);
  }

  if (password !== confirmPassword) {
    error = new HttpError("Passwords doesn't match!", 422);
    return next(error);
  }

  const securedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    email,
    password: securedPassword,
  });

  try {
    await user.save();
    return res.json({
      message: "User created",
    });
  } catch (err) {
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let error = validationResult(req);
  if (!error.isEmpty()) {
    error = new HttpError(error.array()[0].msg, 422);
    return next(error);
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      error = new HttpError("User with that email doesn't exists.", 422);
      return next(error);
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      error = new HttpError("Enter a correct password.", 422);
      return next(error);
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY
    );
    return res.json({
      message: "Logged In",
      user: { accessToken, userId: user._id, isAdmin: user.isAdmin },
    });
  } catch (err) {
    return next(err);
  }
};
