const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const Post = require("../models/post");
const Conversation = require("../models/conversation");

exports.updateUser = async (req, res, next) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    try {
      const user = await User.findByIdAndUpdate(req.user.id, {
        $set: req.body,
      });
      await user.save();
      const { username, email, city, from } = user._doc;
      return res.json({
        message: "User updated",
        user: { username, email, city, from },
      });
    } catch (err) {
      err = new HttpError(err.message, 500);
      return next(err);
    }
  } else {
    const error = new HttpError("You are not allowed to update this user.");
    return next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...info } = user._doc;

    return res.json({
      user: info,
    });
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.user.id);
      await Post.deleteMany({ userId: req.user.id });
      await Conversation.deleteMany({
        members: { $in: [req.params.userId] },
      });
      return res.json("User deleted successfully");
    } catch (err) {
      err = new HttpError(err.message, 500);
      return next(err);
    }
  } else {
    const error = new HttpError("You are not allowed to delete a user.");
    return next(error);
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const user = req.query.userId
      ? await User.findOne({ _id: req.query.userId })
      : await User.findOne({ username: req.query.username });
    const friendLists = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    const friends = friendLists.map((friend) => {
      if (friend) {
        const { _id, profilePicture, username } = friend;
        return { _id, profilePicture, username };
      } else {
        return null;
      }
    });
    const returnFriends = friends.filter((friend) => friend !== null);
    return res.json(returnFriends);
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.putFollow = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const followUser = await User.findById(req.params.userId);
  try {
    if (req.user.id !== req.params.userId) {
      if (!user.followings.includes(followUser)) {
        await user.updateOne({
          $push: { followings: req.params.userId },
        });
        await user.save();

        await followUser.updateOne({
          $push: { followers: req.user.id },
        });
        await followUser.save();

        return res.json("You are now following " + followUser.username);
      } else {
        const error = new HttpError("You already follow that user!", 403);
        return next(error);
      }
    } else {
      const error = new HttpError("You can't follow yourself!", 403);
      return next(error);
    }
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.putUnfollow = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const followUser = await User.findById(req.params.userId);
  try {
    if (req.user.id !== req.params.userId) {
      if (!user.followings.includes(followUser)) {
        await user.updateOne({
          $pull: { followings: req.params.userId },
        });
        await user.save();

        await followUser.updateOne({
          $pull: { followers: req.user.id },
        });
        await followUser.save();

        return res.json("You unfollowed " + followUser.username);
      } else {
        const error = new HttpError("You don't follow that user", 403);
        return next(error);
      }
    } else {
      const error = new HttpError("You can't unfollow yourself!", 403);
      return next(error);
    }
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};
