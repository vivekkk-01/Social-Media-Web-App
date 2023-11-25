import React from "react";
import classes from "./login.module.css";
import { Form, redirect, useNavigation, Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

const Login = () => {
  const submit = useNavigation();
  const isSubmitting = submit.state === "submitting";
  return (
    <div className={classes.login}>
      <div className={classes.container}>
        <div className={classes.left}>
          <h1>ViSocial</h1>
          <h3>Connect with friends and the world around you on ViSocial</h3>
        </div>
        <Form className={classes.right} method="post">
          <input
            type="email"
            required
            name="email"
            placeholder="Email"
            className={classes.input}
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
            className={classes.input}
          />
          <button className={classes.loginButton}>
            {isSubmitting ? <CircularProgress size={"18px"} /> : "Log In"}
          </button>
          <span>Forgot Password?</span>
          <Link to="/register" className={classes.registerButton}>
            Create A New Account
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;

export const action = async ({ request }) => {
  console.log("LOGIN");
  const data = await request.formData();
  const userData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  const response = await fetch("https://social-media-backend-vmbf.onrender.com/auth/login", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const resData = await response.json();
  if (!response.ok) {
    window.alert(resData.message);
    return null;
  }
  if (response.ok) {
    localStorage.setItem("socialUser", JSON.stringify(resData.user));
    return redirect("/");
  }
  return null;
};

export const loader = () => {
  const userObj = localStorage.getItem("socialUser");
  const user = JSON.parse(userObj);
  console.log("let's see...");
  if (user) {
    return redirect("/");
  }
  return null;
};
