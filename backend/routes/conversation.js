const router = require("express").Router();

const conversationControllers = require("../controllers/conversation");

router.post("/", conversationControllers.postConversation);

router.get("/:userId", conversationControllers.getConversation);

router.get(
  "/find/:firstUserId/:secondUserId",
  conversationControllers.getConversationTwo
);

module.exports = router;
