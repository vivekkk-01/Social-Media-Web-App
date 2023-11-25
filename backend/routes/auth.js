const router = require("express").Router();
const { body } = require("express-validator");

const authControllers = require("../controllers/auth");

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username should contain 3 to 20 characters"),
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .withMessage("password should contain 8 to 20 characters"),
  ],
  authControllers.postRegister
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .withMessage("password should contain 8 to 20 characters"),
  ],
  authControllers.postLogin
);
module.exports = router;
