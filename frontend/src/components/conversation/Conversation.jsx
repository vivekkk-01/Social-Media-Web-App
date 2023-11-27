import React, { useState, useEffect } from "react";
import classes from "./conversation.module.css";

const Conversation = ({ conversation, user }) => {
  const [friend, setFriend] = useState({});

  useEffect(() => {
    (async () => {
      const friendId = conversation.members.find(
        (member) => member !== user.userId
      );
      const response = await fetch(
        "https://social-media-backend-vmbf.onrender.com/user/single?userId=" + friendId,
        {
          headers: {
            authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const resData = await response.json();
      setFriend(resData.user ? resData.user : {});
    })();
  }, [conversation]);

  return (
    <div className={classes.conversation}>
      <img
        className={classes.img}
        src={
          friend?.profilePicture
            ? friend?.profilePicture
            : "https://www.pngkey.com/png/detail/121-1219160_small-facebook-no-profile-picture-girl.png"
        }
        alt=""
      />
      <span className={classes.name}>{friend?.username}</span>
    </div>
  );
};

export default Conversation;
