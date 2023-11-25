import React, { useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import classes from "./messenger.module.css";
import { io } from "socket.io-client";

const Messenger = () => {
  const currentUser = useRouteLoaderData("user").user;
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const userObj = JSON.parse(localStorage.getItem("socialUser"));
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((friend) =>
          users.some((u) => u.userId == friend)
        )
      );
    });
  }, [socket, currentUser]);

  const scrollRef = useRef();
  const handleMessage = (event) => {
    const recieverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      recieverId,
      text: newMessage,
    });

    event.preventDefault();
    (async () => {
      const messageObj = {
        conversationId: currentChat._id,
        sender: userObj.userId,
        text: newMessage,
      };
      await fetch("https://social-media-backend-vmbf.onrender.com/message/", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageObj),
      });
      setMessages((prev) => {
        return [...prev, messageObj];
      });
      setNewMessage("");
    })();
  };
  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://social-media-backend-vmbf.onrender.com/conversation/" + userObj.userId
      );

      const resData = await response.json();
      setConversations(resData);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://social-media-backend-vmbf.onrender.com/message/" + currentChat?._id
      );

      const resData = await response.json();
      setMessages(resData);
    })();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className={classes.messenger}>
      <div className={classes.menu}>
        <div className={classes.menuWrapper}>
          <input className={classes.input} placeholder="Search for friends" />
          {conversations.map((conversation) => {
            return (
              <div
                key={conversation._id}
                onClick={() => setCurrentChat(conversation)}
              >
                <Conversation conversation={conversation} user={userObj} />
              </div>
            );
          })}
        </div>
      </div>
      <div className={classes.box}>
        <div className={classes.boxWrapper}>
          {currentChat ? (
            <>
              <div className={classes.boxTop}>
                {messages.length > 0 ? (
                  messages.map((message) => {
                    return (
                      <div ref={scrollRef}>
                        <Message
                          key={message._id}
                          own={message.sender == userObj.userId}
                          message={message}
                        />
                      </div>
                    );
                  })
                ) : (
                  <h1 style={{ color: "gray" }}>
                    Start a conversation with your friend
                  </h1>
                )}
              </div>
              <div className={classes.boxBottom}>
                <textarea
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  className={classes.textarea}
                  placeholder="Write something..."
                  rows="10"
                ></textarea>
                <button className={classes.button} onClick={handleMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <h1 style={{ color: "gray" }}>Start a conversation now :)</h1>
          )}
        </div>
      </div>
      <div className={classes.online}>
        <div className={classes.onlineWrapper}>
          <ChatOnline
            onlineUsers={onlineUsers}
            currentId={currentUser._id}
            setCurrentChat={setCurrentChat}
            accessToken={userObj.accessToken}
          />
        </div>
      </div>
    </div>
  );
};

export default Messenger;
