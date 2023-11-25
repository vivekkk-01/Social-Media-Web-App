import React from "react";
import classes from "./home.module.css";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";

const Home = () => {
  return (
    <div className={classes.container}>
      <Sidebar />
      <Feed />
      <Rightbar />
    </div>
  );
};

export default Home;
