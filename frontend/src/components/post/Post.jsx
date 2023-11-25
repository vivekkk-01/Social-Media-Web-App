import { Delete, Edit, MoreVert } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import classes from "./post.module.css";
import moment from "moment";
import { Link, useRouteLoaderData } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import Modal from "../modal/Modal";

const Post = ({ post, userId }) => {
  const currentUser = useRouteLoaderData("user");
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [desc, setDesc] = useState(post.desc);

  const descRef = useRef();

  const userObj = JSON.parse(localStorage.getItem("socialUser"));

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser?.user._id));
  }, [currentUser, post]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://localhost:8080/user/single?userId=" + userId,
        {
          headers: {
            authorization: "Bearer " + userObj.accessToken,
          },
        }
      );

      const resData = await response.json();
      setUser(resData.user);
    })();
  }, []);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    (async () => {
      await fetch(`http://localhost:8080/post/like/${post._id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${userObj.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.user._id,
        }),
      });
    })();
  };

  const deletePostHandler = (postId) => {
    setIsEdit(false);
    setIsEditing(true);
    (async () => {
      await fetch("http://localhost:8080/post/" + postId, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${userObj.accessToken}`,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    })();
  };

  const editPostHandler = (postId) => {
    setEditPost(!editPost);
  };

  const updatePostHandler = (postId) => {
    setIsEditingPost(true);
    (async () => {
      await fetch("http://localhost:8080/post/" + postId, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${userObj.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desc: descRef.current.value }),
      });
      setIsEditingPost(false);
      setIsEdit(false);
      setEditPost(false);
    })();
    setDesc(descRef.current.value);
  };

  return (
    <div className={classes.post}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.topLeft}>
            <Link to={`../profile/${user?.username}`} state={{ user: user }}>
              <img
                className={classes.postUserImg}
                src={
                  user?.profilePicture
                    ? user?.profilePicture
                    : "https://raw.githubusercontent.com/safak/youtube/mern-social-app/client/public/assets/person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <p className={classes.postName}>{user?.username}</p>
            <span className={classes.postDate}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          {!isEditing ? (
            <div
              className={classes.topRight}
              onClick={() => {
                setIsEdit(!isEdit);
                setEditPost(false);
              }}
            >
              <MoreVert />
            </div>
          ) : (
            <CircularProgress />
          )}
          {isEdit && (
            <div className={classes.edit}>
              <p onClick={editPostHandler}>
                Edit Post <Edit className={classes.editIcon} />
              </p>
              <p onClick={deletePostHandler.bind(null, post._id)}>
                Delete Post{" "}
                <Delete className={classes.editIcon} htmlColor="red" />
              </p>
            </div>
          )}
        </div>
        <div className={classes.center}>
          {!editPost && (
            <span
              className={classes.postCaption}
              style={{ transition: "1s all" }}
            >
              {desc ? desc : ""}
            </span>
          )}
          {editPost && (
            <div style={{ transition: "1s all" }}>
              <input
                type={"text"}
                placeholder={desc ? desc : ""}
                style={{
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid black",
                  width: "70%",
                  padding: ".3rem 0",
                  display: "block",
                }}
                minLength="10"
                required
                ref={descRef}
              />
              <button
                onClick={updatePostHandler.bind(null, post._id)}
                style={{
                  marginTop: ".5rem",
                  padding: ".5rem",
                  background: "#1877f2",
                  color: "white",
                  fontSize: ".9rem",
                  width: "5rem",
                  border: "none",
                  outline: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                }}
              >
                {isEditingPost ? <CircularProgress size="16px" /> : "Update"}
              </button>
            </div>
          )}
          <img
            className={classes.postImg}
            src={`http://localhost:8080/${post.img}`}
            alt=""
          />
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottomLeft}>
            <img
              onClick={likeHandler}
              className={classes.likeIcon}
              style={{ cursor: "pointer" }}
              src="https://www.freepngimg.com/download/youtube/77724-emoticon-like-button-youtube-up-facebook-thumbs.png"
              alt=""
            />
            <img
              onClick={likeHandler}
              style={{ cursor: "pointer" }}
              src="https://purepng.com/public/uploads/large/heart-icon-jst.png"
              alt=""
            />
            <span>{like} people liked your post</span>
          </div>
          <div className={classes.bottomRight}>
            <span className={classes.comments}>{8} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
