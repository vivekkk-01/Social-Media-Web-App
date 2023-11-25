import React, { useState, useEffect } from "react";
import classes from "./conversation.module.css";

const Conversation = ({ conversation, user }) => {
  const [friend, setFriend] = useState({});

  useEffect(() => {
    (async () => {
      const friendId = conversation.members.find(
        (member) => member !== user.userId
      );
      console.log(friendId);
      const response = await fetch(
        "http://localhost:8080/user/single?userId=" + friendId,
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
            : "https://raw.githubusercontent.com/safak/youtube/mern-social-app/client/public/assets/person/noAvatar.png"
        }
        alt=""
      />
      <span className={classes.name}>{friend?.username}</span>
    </div>
  );
};

export default Conversation;
