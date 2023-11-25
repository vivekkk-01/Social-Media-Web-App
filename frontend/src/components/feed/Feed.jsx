import React from "react";
import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import Post from "../post/Post";
import Share from "../share/Share";
import classes from "./feed.module.css";

const Feed = () => {
  const params = useParams().username;
  const userObj = useRouteLoaderData("user").user;
  const data = useLoaderData();
  return (
    <div className={classes.feed}>
      {params && userObj?.username === params ? (
        <Share />
      ) : !params ? (
        <Share />
      ) : null}
      {data.length > 0 ? (
        data
          .sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
          .map((post) => {
            if (post == null || post == undefined) {
              return null;
            } else {
              return <Post key={post._id} post={post} userId={post.userId} />;
            }
          })
      ) : !params && data.length <= 0 ? (
        <h1 style={{ textAlign: "center" }}>
          You have 0 posts in your Timeline!
        </h1>
      ) : (
        <h1 style={{ textAlign: "center" }}>{`${
          params !== userObj.username
            ? ` ${params} has not posted anything`
            : `You haven't posted anything `
        }`}</h1>
      )}
    </div>
  );
};

export default Feed;

export const loader = async ({ params }) => {
  const userObj = JSON.parse(localStorage.getItem("socialUser"));
  let url = "http://localhost:8080/post/timeline/" + userObj.userId;

  const userName = params.username;

  if (userName) {
    url = "http://localhost:8080/post/user/" + userName;
  }

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${userObj.accessToken}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    window.alert(resData.message);
    resData.message = "";
    return;
  }

  return resData;
};
