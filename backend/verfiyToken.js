const jwt = require("jsonwebtoken");
const HttpError = require("./models/http-error");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    const error = new HttpError("You are not authenticated", 420);
    return next(error);
  } else {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        err = new HttpError("Token is invalid!", 420);
        return next(err);
      } else {
        req.user = user;
        return next();
      }
    });
  }
};

module.exports = verifyToken;
