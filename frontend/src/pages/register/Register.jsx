import React from "react";
import classes from "./register.module.css";
import { Form, Link, redirect, useNavigation } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Register = () => {
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
            name="username"
            required
            type="text"
            placeholder="Username"
            className={classes.input}
          />
          <input
            name="email"
            required
            type="email"
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
          <input
            name="confirmPassword"
            required
            type="password"
            placeholder="Password"
            className={classes.input}
          />
          <button className={classes.loginButton}>
            {isSubmitting ? (
              <CircularProgress size={"18px"} />
            ) : (
              "Create Account"
            )}
          </button>
          <Link to="/login" className={classes.registerButton}>
            Alredy have an Account?
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Register;

export const action = async ({ request }) => {
  const data = await request.formData();
  const userData = {
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  };
  const response = await fetch("https://social-media-backend-vmbf.onrender.com/auth/register", {
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
  return redirect("/login");
};

export const loader = () => {
  const userObj = localStorage.getItem("socialUser");
  const user = JSON.parse(userObj);
  if (user) {
    return redirect("/");
  }
  return null;
};
