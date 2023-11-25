const router = require("express").Router();
const verfiyToken = require("../verfiyToken");

const { body } = require("express-validator");

const postControllers = require("../controllers/post");
const verifyToken = require("../verfiyToken");
const fileUpload = require("../file-upload");

// CREATE
router.post(
  "/",
  verfiyToken,
  fileUpload.single("img"),
  [
    body("desc")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description should contain no more than 500 characters"),
  ],
  postControllers.createPost
);

// UPDATE
router.put(
  "/:postId",
  verfiyToken,
  [
    body("desc")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description should contain no more than 500 characters"),
  ],
  postControllers.putPost
);

// GET USER POSTS
router.get("/user/:username", verifyToken, postControllers.getUserPosts);

// DELETE
router.delete("/:postId", verfiyToken, postControllers.deletePost);

// LIKE / DISLIKE
router.put("/like/:postId", verifyToken, postControllers.putLike);

// GET
router.get("/:postId", verifyToken, postControllers.getPost);

// GET POSTS TIMELINE
router.get("/timeline/:userId", verifyToken, postControllers.getTimeline);

module.exports = router;
