import classes from "./chatOnline.module.css";
import { useEffect, useState } from "react";

const ChatOnline = ({
  onlineUsers,
  setCurrentChat,
  currentId,
  accessToken,
}) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://localhost:8080/user/friends?userId=" + currentId,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resData = await response.json();
      setFriends(resData);
    })();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleChat = (friend) => {
    (async () => {
      const response = await fetch(
        `http://localhost:8080/conversation/find/${currentId}/${friend._id}`
      );

      const resData = await response.json();
      console.log("responding...");
      setCurrentChat(resData);
    })();
  };

  return (
    <div className={classes.onlineFriends}>
      {onlineFriends?.map((friend) => {
        return (
          <div
            className={classes.chatOnline}
            key={friend._id}
            onClick={handleChat.bind(null, friend)}
          >
            <div className={classes.imgContainer}>
              <img
                className={classes.img}
                src={
                  friend.profilePicture
                    ? friend.profilePicture
                    : "https://raw.githubusercontent.com/safak/youtube/mern-social-app/client/public/assets/person/noAvatar.png"
                }
              />
              <div className={classes.badge}></div>
            </div>
            <span className={classes.span}>{friend.username}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatOnline;
