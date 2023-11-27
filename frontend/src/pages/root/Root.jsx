import React from "react";
import Topbar from "../../components/topbar/Topbar";
import { Outlet, redirect, useRouteLoaderData } from "react-router-dom";

const Root = () => {
  const data = useRouteLoaderData("user");
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  );
};

export default Root;

export const loader = async () => {
  const userObj = localStorage.getItem("socialUser");
  const socialUser = JSON.parse(userObj);
  if (!socialUser) {
    return redirect("/login");
  }
  const response = await fetch(
    `https://social-media-backend-vmbf.onrender.com/user/single?userId=${socialUser.userId}`,
    {
      headers: {
        authorization: `Bearer ${socialUser.accessToken}`,
      },
    }
  );

  return response;
};
