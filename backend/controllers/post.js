const Post = require("../models/post");
const User = require("../models/user");

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { create } = require("../models/post");

exports.createPost = async (req, res, next) => {
  console.log(req.file.path, "POST");
  if (req.body.userId === req.user.id) {
    const user = User.findById(req.user.id);
    const newPost = new Post({
      userId: req.user.id,
      desc: req.body.desc,
      img: req.file.path,
    });
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = new HttpError(error.array()[0].msg, 403);
      return next(error);
    }
    console.log("POST");
    try {
      await newPost.save();
      await user.updateOne({ $push: { posts: newPost._id } });

      return res.json({ message: "Post created", post: newPost });
    } catch (err) {
      err = new HttpError(err.message, 500);
      return next(err);
    }
  } else {
    const err = new HttpError("You couldn't post", 500);
    return next(err);
  }
};

exports.putPost = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  let error = validationResult(req);
  if (!error.isEmpty()) {
    error = new HttpError(error.array()[0].msg, 403);
    return next(error);
  }

  try {
    post.desc = req.body.desc;
    post.userId = req.user.id;
    await post.save();
    return res.json({ message: "Post updated", post });
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  const user = await User.findById(req.user.id);
  try {
    await user.updateOne({ $pull: { posts: post._id } });
    await Post.findByIdAndDelete(req.params.postId);
    return res.json({ message: "Post deleted", user });
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.putLike = async (req, res, next) => {
  if (req.body.userId === req.user.id) {
    const post = await Post.findById(req.params.postId);
    try {
      if (post.likes.includes(req.user.id)) {
        await post.updateOne({ $pull: { likes: req.user.id } });
      } else {
        await post.updateOne({ $push: { likes: req.user.id } });
      }
      return res.json(post);
    } catch (err) {
      err = new HttpError(err.message, 500);
      return next(err);
    }
  } else {
    const err = new HttpError("You couldn't like this post", 401);
    return next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    return res.json(post);
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.getTimeline = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    err = new HttpError(err.message, 500);
    return next(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};
