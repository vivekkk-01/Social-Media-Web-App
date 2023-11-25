import React, { useEffect, useState } from "react";
import classes from "./rightbar.module.css";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import { Users } from "../../dummyData";
import OnlineFriends from "../OnlineFriends/OnlineFriends";
import { Add, Edit, Remove } from "@material-ui/icons";
import { loader as rootLoader } from "../../pages/root/Root";

const Rightbar = ({ user }) => {
  rootLoader();
  const [friends, setFriends] = useState([]);
  const currentUser = useRouteLoaderData("user").user;
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.followings.includes(user?._id)
  );
  const username = useParams().username;
  const userObj = JSON.parse(localStorage.getItem("socialUser"));
  const [isRelationship, setIsRelationship] = useState(false);
  const [relationship, setRelationship] = useState(user?.relationship);

  useEffect(() => {
    setIsFollowing(user && currentUser?.followings.includes(user?._id));
  }, [user, currentUser?.followings]);

  useEffect(() => {
    if (username) {
      (async () => {
        const response = await fetch(
          `http://localhost:8080/user/friends?username=${username}`,
          {
            headers: {
              authorization: `Bearer ${userObj.accessToken}`,
            },
          }
        );
        const resData = await response.json();
        if (!response.ok) {
          window.alert(resData.message);
        }
        setFriends(resData);
      })();
    }
  }, [username, isFollowing]);

  const followHandler = () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      (async () => {
        await fetch(`http://localhost:8080/user/unfollow/${user._id}`, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${userObj.accessToken}`,
          },
        });
      })();
    } else {
      (async () => {
        await fetch(`http://localhost:8080/user/follow/${user._id}`, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${userObj.accessToken}`,
          },
        });
      })();
    }
  };

  const relationshipHandler = (e) => {
    setRelationship(e.target.value);
    setIsRelationship(false);
  };

  let rightBar = (
    <>
      <div className={classes.top}>
        <img
          className={classes.topImg}
          src="https://cdn1.iconfinder.com/data/icons/party-and-celeberation/78/17-512.png"
          alt=""
        />
        <span className={classes.topText}>
          <b>Johnny Dogs</b> and <b>3 other friends</b> have birthday today
        </span>
      </div>
      <img
        className={classes.centerImg}
        src="https://tse4.mm.bing.net/th?id=OIP.UlBi0BN3cV32AF2xH-6aAAHaD4&pid=Api&P=0"
        alt=""
      />
      <div className={classes.bottom}>
        <h2 className={classes.bottomTitle}>Online Friends</h2>
        {Users.map((user) => {
          return <OnlineFriends key={user.id} friend={user} />;
        })}
      </div>
    </>
  );
  if (user) {
    rightBar = (
      <>
        <div className={classes.userInfo}>
          {currentUser?.username !== username && (
            <button className={classes.followBtn} onClick={followHandler}>
              {isFollowing ? (
                <>
                  <Remove /> Unfollow
                </>
              ) : (
                <>
                  <Add /> Follow
                </>
              )}
            </button>
          )}
          <h3>User information</h3>
          <div className={classes.userInfoItem}>
            <span className={classes.userInfoItemKey}>City:</span>
            <span className={classes.userInfoItemValue}>
              {user.city ? user.city : "Undisclosed"}
            </span>
            <Edit className={classes.editIcon} />
          </div>
          <div className={classes.userInfoItem}>
            <span className={classes.userInfoItemKey}>From:</span>
            <span className={classes.userInfoItemValue}>
              {user.from ? user.from : "Undisclosed"}
            </span>
            <Edit className={classes.editIcon} />
          </div>
          <div className={classes.userInfoItem}>
            <span className={classes.userInfoItemKey}>Relationship:</span>
            {!isRelationship && (
              <span className={classes.userInfoItemValue}>
                {relationship ? relationship : "Undisclosed"}
              </span>
            )}
            {isRelationship && (
              <select
                onChange={relationshipHandler}
                style={{ padding: ".3rem", border: "#1877f2" }}
              >
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
              </select>
            )}
            <Edit
              className={classes.editIcon}
              onClick={() => setIsRelationship(!isRelationship)}
            />
          </div>
        </div>
        <div className={classes.userFriends}>
          {friends.map((friend) => {
            return (
              <Link
                to={`/profile/${friend.username}`}
                className={classes.userFriendItem}
                key={friend._id}
              >
                <img
                  className={classes.userFriendImg}
                  src={
                    friend.profilePicture
                      ? friend.profilePicture
                      : "https://raw.githubusercontent.com/safak/youtube/mern-social-app/client/public/assets/person/noAvatar.png"
                  }
                  alt=""
                />
                <span>{friend.username}</span>
              </Link>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <div className={classes.rightbar}>
      <div className={classes.wrapper}>{rightBar}</div>
    </div>
  );
};

export default Rightbar;
