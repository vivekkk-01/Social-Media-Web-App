import React, { useState } from "react";
import { useRouteLoaderData, useNavigation } from "react-router-dom";
import classes from "./share.module.css";
import {
  Cancel,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

const Share = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [img, setImg] = useState(null);
  const [desc, setDesc] = useState("");

  const imgHandler = (event) => {
    setImg(event.target.files[0]);
  };

  const userObj = JSON.parse(localStorage.getItem("socialUser"));

  const body = new FormData();
  body.append("img", img);
  body.append("desc", desc);
  body.append("userId", userObj.userId);
  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    (async () => {
      await fetch("https://social-media-backend-vmbf.onrender.com/post", {
        body,
        method: "POST",
        headers: {
          authorization: `Bearer ${userObj.accessToken}`,
        },
      });
      setTimeout(() => {
        setIsSubmitting(false);
        window.location.reload();
      }, 2000);
    })();
  };
  const descHandler = (event) => {
    setDesc(event.target.value);
  };

  const userData = useRouteLoaderData("user").user;
  return (
    <div className={classes.share}>
      {isSubmitting && (
        <CircularProgress size={"50px"} className={classes.isSubmitting} />
      )}
      <div className={classes.wrapper}>
        <div className={classes.shareTop}>
          <img
            className={classes.shareImg}
            src={
              userData?.profilePicture
                ? userData?.profilePicture
                : "https://raw.githubusercontent.com/safak/youtube/mern-social-app/client/public/assets/person/noAvatar.png"
            }
            alt=""
          />
          <input
            type="text"
            className={classes.shareInput}
            placeholder={`What's on your mind, ${userData?.username}?`}
            onChange={descHandler}
          />
        </div>
        <hr className={classes.hr} />
        {img && (
          <div className={classes.shareImgContainer}>
            <img
              className={classes.shareImgPrev}
              src={URL.createObjectURL(img)}
              alt=""
            />
            <Cancel
              className={classes.shareCancelImg}
              onClick={() => setImg(null)}
            />
          </div>
        )}
        <form
          className={classes.shareBottom}
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className={classes.bottomItems}>
            <label
              htmlFor="file"
              className={classes.bottomItem}
              style={{ cursor: "pointer" }}
            >
              <PermMedia className={classes.shareIcon} htmlColor="tomato" />
              Photo
              <input
                hidden
                name="image"
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                style={{ display: "none" }}
                onChange={imgHandler}
              />
            </label>

            <div className={classes.bottomItem}>
              <Label className={classes.shareIcon} htmlColor="darkblue" />
              Tag
            </div>

            <div className={classes.bottomItem}>
              <Room className={classes.shareIcon} htmlColor="green" />
              Location
            </div>

            <div className={classes.bottomItem}>
              <EmojiEmotions
                className={classes.shareIcon}
                htmlColor="goldenrod"
              />
              Feeligns
            </div>
          </div>
          <button className={classes.button}>Share</button>
        </form>
      </div>
    </div>
  );
};

export default Share;
