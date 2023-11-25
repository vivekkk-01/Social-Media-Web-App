const { body } = require("express-validator");
const verifyToken = require("../verfiyToken");

const router = require("express").Router();
const userControllers = require("../controllers/user");

// UPDATE
router.put("/update/:userId", verifyToken, [
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
      .withMessage("password should contain 3 to 20 characters"),
    body("city")
      .trim()
      .isLength({ max: 50 })
      .withMessage("City should contain maximum 50 characters"),
    body("description")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Description should contain maximum 50 characters"),
  ],
  userControllers.updateUser,
]);

// GET
router.get("/single", verifyToken, userControllers.getUser);

// DELETE
router.delete("/delete/:userId", verifyToken, userControllers.deleteUser);

// GET ALL
router.get("/friends", verifyToken, userControllers.getFriends);

// FOLLOW
router.put("/follow/:userId", verifyToken, userControllers.putFollow);

// UNFOLLOW
router.put("/unfollow/:userId", verifyToken, userControllers.putUnfollow);
module.exports = router;
