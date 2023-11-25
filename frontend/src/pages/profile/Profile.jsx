import classes from "./profile.module.css";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { loader as rootLoader } from "../../pages/root/Root";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  rootLoader();
  const [userData, setUserData] = useState({});
  const param = useParams().username;
  const userObj = JSON.parse(localStorage.getItem("socialUser"));

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://social-media-backend-vmbf.onrender.com/user/single?username=" + param,
        {
          headers: {
            authorization: `Bearer ${userObj.accessToken}`,
          },
        }
      );
      const resData = await response.json();
      setUserData(resData.user);
    })();
  }, [param]);
  const state = useLocation();
  const user = !state.state ? userData : state.state.user;
  return (
    <div className={classes.container}>
      <Sidebar />
      <div className={classes.right}>
        <div className={classes.top}>
          <div className={classes.topImages}>
            <img
              className={classes.coverImg}
              src={
                user.coverPicture
                  ? user.coverPicture
                  : "https://github.com/safak/youtube/blob/mern-social-app/client/public/assets/person/noCover.png?raw=true"
              }
              alt=""
            />
            <img
              className={classes.profileImg}
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "https://github.com/safak/youtube/blob/mern-social-app/client/public/assets/person/noAvatar.png?raw=true"
              }
              alt=""
            />
          </div>
          <div className={classes.topInfo}>
            <h3>{user.username}</h3>
            <span>Don't mess with the Peaky fookin Blinders!</span>
          </div>
        </div>
        <div className={classes.bottom}></div>
        <div className={classes.bottom}>
          <Feed />
          <Rightbar user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
