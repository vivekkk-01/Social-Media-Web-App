import React from "react";

import classes from "./closeFriend.module.css";

const CloseFriend = ({ friend }) => {
  return (
    <li className={classes.friend}>
      <img className={classes.friendImg} src={friend.profilePicture} alt="" />
      <span className={classes.friendName}>{friend.username}</span>
    </li>
  );
};

export default CloseFriend;
