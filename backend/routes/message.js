const router = require("express").Router();

const messageControllers = require("../controllers/message");

router.post("/", messageControllers.postMessage);

router.get("/:conversationId", messageControllers.getMessages);

module.exports = router;
