import React from "react";
import classes from "./onlineFriends.module.css";

const OnlineFriends = ({ friend }) => {
  return (
    <div className={classes.bottomItem}>
      <div className={classes.friend}>
        <img className={classes.friendImg} src={friend.profilePicture} alt="" />
        <div className={classes.friendBadge}></div>
      </div>
      <span className={classes.friendName}>{friend.username}</span>
    </div>
  );
};

export default OnlineFriends;
