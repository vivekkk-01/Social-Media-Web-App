const Message = require("../models/message");
const HttpError = require("../models/http-error");

exports.postMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    return res.json(newMessage);
  } catch (err) {
    err = new HttpError("Something went wrong, please try again", 500);
    return next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.json(messages);
  } catch (err) {
    err = new HttpError("Something went wrong, please try again", 500);
    return next(err);
  }
};
