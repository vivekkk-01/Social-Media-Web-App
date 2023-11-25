import React, { useState } from "react";
import classes from "./sidebar.module.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  PowerSettingsNew,
  Delete,
} from "@mui/icons-material";

import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import Modal from "../modal/Modal";
import { CircularProgress } from "@material-ui/core";

const Sidebar = () => {
  const userObj = JSON.parse(localStorage.getItem("socialUser"));
  const [isLogout, setIsLogout] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isLogoutWait, setIsLogoutWait] = useState(false);
  const [isDeleteWait, setIsDeleteWait] = useState(false);

  const deleteHandler = () => {
    setIsDelete(true);
  };

  const handleLogOut = () => {
    setIsLogout(true);
  };

  const logout = () => {
    setIsLogoutWait(true);
    localStorage.removeItem("socialUser");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const deleteAccount = () => {
    setIsDeleteWait(true);
    localStorage.removeItem("socialUser");
    (async () => {
      await fetch("https://social-media-backend-vmbf.onrender.com/user/delete/" + userObj.userId, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${userObj.accessToken}`,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })();
  };
  return (
    <>
      {isLogout && (
        <Modal onClose={() => setIsLogout(false)}>
          <h2>Logging Out</h2>
          <p
            style={{
              color: "black",
              fontWeight: "500",
              fontStyle: "italic",
              margin: ".5rem 0",
            }}
          >
            After log out, all your data will be safe, and you'll only be able
            to log in again with your credentials.
          </p>
          <b style={{ display: "block" }}>Do you still want to log out?</b>
          <button
            onClick={() => setIsLogout(false)}
            style={{
              padding: "0.5rem 2rem",
              cursor: "pointer",
              color: "#1877f2",
              background: "transparent",
              borderRadius: "25px",
              border: "1px solid #1877f2",
              fontSize: "1.1rem",
              margin: ".9rem .5rem 0.9rem 0",
            }}
          >
            Close
          </button>
          <button
            onClick={logout}
            style={{
              fontSize: "1.1rem",
              margin: ".9rem .5rem 0.9rem 0",
              padding: "0.5rem 2rem",
              cursor: "pointer",
              color: "white",
              background: "#1877f2",
              borderRadius: "25px",
              border: "none",
            }}
          >
            {isLogoutWait ? <CircularProgress size="18px" /> : "Log out"}
          </button>
        </Modal>
      )}
      {isDelete && (
        <Modal onClose={() => setIsDelete(false)}>
          <h2>Deleting Account</h2>
          <p style={{ margin: ".6rem 0 " }}>
            By clicking <b>Delete</b>, your account will be deleted instantly.
            You'll no longer be able to access your ViSocial account. In order
            to use ViSocial again, you should create a new account.
          </p>
          <select
            style={{
              border: "1px solid #1877f2",
              padding: ".5rem",
              outline: "none",
              margin: ".7rem 0",
            }}
          >
            <option>Why do you want to delete your account?</option>
            <option>Privacy reasons</option>
            <option>The platform is a distraction</option>
            <option>Too many ads</option>
            <option>Something else</option>
          </select>
          <br />
          <b>Do you still want to delete your account?</b>
          <br />
          <button
            onClick={() => setIsDelete(false)}
            style={{
              fontSize: "1.1rem",
              margin: ".9rem .5rem 0.9rem 0",
              padding: "0.5rem 2rem",
              cursor: "pointer",
              color: "white",
              background: "#1877f2",
              borderRadius: "25px",
              border: "none",
            }}
          >
            Close
          </button>
          <button
            onClick={deleteAccount}
            style={{
              fontSize: "1.1rem",
              margin: ".9rem .5rem 0.9rem 0",
              padding: "0.5rem 2rem",
              cursor: "pointer",
              color: "white",
              background: "red",
              borderRadius: "25px",
              border: "none",
            }}
          >
            {isDeleteWait ? <CircularProgress size="18px" /> : "Delete"}
          </button>
        </Modal>
      )}
      <div className={classes.sidebar}>
        <div className={classes.wrapper}>
          <ul className={classes.sidebarList}>
            <li className={classes.sidebarListItem}>
              <RssFeed className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Feed</span>
            </li>
            <li className={classes.sidebarListItem}>
              <Chat className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Chats</span>
            </li>
            <li className={classes.sidebarListItem}>
              <PlayCircleFilledOutlined className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Videos</span>
            </li>
            <li className={classes.sidebarListItem}>
              <Group className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Groups</span>
            </li>
            <li className={classes.sidebarListItem}>
              <Bookmark className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Bookmarks</span>
            </li>
            <li className={classes.sidebarListItem}>
              <HelpOutline className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Questions</span>
            </li>
            <li className={classes.sidebarListItem}>
              <WorkOutline className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Jobs</span>
            </li>
            <li className={classes.sidebarListItem}>
              <Event className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Events</span>
            </li>
            <li className={classes.sidebarListItem}>
              <School className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Courses</span>
            </li>
            <li
              className={classes.sidebarListItem}
              onClick={handleLogOut}
              style={{ cursor: "pointer" }}
            >
              <PowerSettingsNew className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>Log Out</span>
            </li>
            <li
              className={classes.sidebarListItem}
              style={{ cursor: "pointer" }}
              onClick={deleteHandler}
            >
              <Delete className={classes.sidebarIcon} />
              <span className={classes.sidebarListItemText}>
                Delete Account
              </span>
            </li>
          </ul>

          <button className={classes.button}>Show More</button>
          <hr className={classes.hr} />
          <ul className={classes.friendList}>
            {Users.map((user) => {
              return <CloseFriend key={user.id} friend={user} />;
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
