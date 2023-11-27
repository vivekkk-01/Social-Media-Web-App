import React from "react";
import classes from "./top.module.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useRouteLoaderData } from "react-router-dom";

const Topbar = () => {
  const userData = useRouteLoaderData("user");
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Link
          to="/"
          className={classes.logo}
          style={{ textDecoration: "none" }}
        >
          ViSocial
        </Link>
      </div>
      <div className={classes.center}>
        <div className={classes.centerContainer}>
          <Search className={classes.searchIcon} />
          <input
            type="text"
            placeholder="Search for friend post or video"
            className={classes.centerInput}
          />
        </div>
      </div>
      <div className={classes.right}>
        <div className={classes.rightLinks}>
          <span>HomePage</span>
          <span>Timeline</span>
        </div>
        <div className={classes.rightIcons}>
          <div className={classes.iconItem}>
            <Person />
            <span className={classes.iconBadge}>1</span>
          </div>
          <Link
            className={classes.iconItem}
            to="/messenger"
            style={{ textDecoration: "none" }}
          >
            <Chat />
            <span className={classes.iconBadge}>2</span>
          </Link>
          <div className={classes.iconItem}>
            <Notifications />
            <span className={classes.iconBadge}>2</span>
          </div>
        </div>
        <Link
          to={`/profile/${userData.user?.username}`}
          state={{ user: userData.user }}
        >
          <img
            className={classes.profileImg}
            src={
              userData.user?.profilePicture ||
              "https://www.pngkey.com/png/detail/121-1219160_small-facebook-no-profile-picture-girl.png"
            }
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
