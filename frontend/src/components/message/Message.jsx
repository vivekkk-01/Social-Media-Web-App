import React from "react";
import classes from "./message.module.css";
import moment from "moment";

const Message = ({ own, message }) => {
  return (
    <div
      className={
        own ? `${classes.message} ${classes.messageOwn}` : classes.message
      }
    >
      <div className={classes.top}>
        <img
          className={classes.profile}
          src="https://static.tvmaze.com/uploads/images/medium_portrait/0/2433.jpg"
          alt=""
        />
        <div className={classes.text}>{message.text}</div>
      </div>
      <div className={classes.bottom}>
        {moment(message.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default Message;
