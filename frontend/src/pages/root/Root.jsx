import React from "react";
import Topbar from "../../components/topbar/Topbar";
import { Outlet, redirect, useRouteLoaderData } from "react-router-dom";

const Root = () => {
  const data = useRouteLoaderData("user");
  console.log(data.user);
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
  console.log("let's see...", socialUser);
  if (!socialUser) {
    return redirect("/login");
  }
  const response = await fetch(
    `http://localhost:8080/user/single?userId=${socialUser.userId}`,
    {
      headers: {
        authorization: `Bearer ${socialUser.accessToken}`,
      },
    }
  );

  return response;
};
