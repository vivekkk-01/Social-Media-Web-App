const Conversation = require("../models/conversation");
const HttpError = require("../models/http-error");

exports.postConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    return res.json(savedConversation);
  } catch (err) {
    err = new HttpError("Something went wrong, please try again later", 500);
    return next(err);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.json(conversations);
  } catch (err) {
    err = new HttpError("Something went wrong, please try again later", 500);
    return next(err);
  }
};

exports.getConversationTwo = async (req, res, next) => {
  try {
    const conversations = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    return res.json(conversations);
  } catch (err) {
    err = new HttpError("Something went wrong, please try again later", 500);
    return next(err);
  }
};
