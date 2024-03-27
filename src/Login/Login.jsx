import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";
import url from "../url.js";
import mixpanel from "../mixpanel.js";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();

  const [Inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Inputs.email.trim() || !Inputs.password.trim()) {
      Swal({
        icon: "warning",
        title: "Please fill out all fields.",
        button: "OK",
      });
      return;
    }

    await axios
      .post(`${url}api/v1/signin`, Inputs)
      .then((response) => {
        navigate("/todo");
        sessionStorage.setItem("id", response.data._id);

        const username = response.data.username;
        localStorage.setItem("username", username);
        const usermail = response.data.email;
        localStorage.setItem("usermail", usermail);
        console.log(username);
        console.log(usermail);

        Swal({
          icon: "success",
          title: "Logged In Successfully.",
          button: "OK",
        });
        navigate("/todo");

        Loggined(usermail);

        mixpanel.identify(usermail);

        mixpanel.people.set({
          $name: username,
          $email: usermail,
          $created: new Date().toISOString(),
          $user_id: usermail,
          test: "Test",
        });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message === "User not found."
        ) {
          Swal({
            icon: "error",
            title: "User not found. Please check your email address.",
            button: "Try Again",
          });
        }
      });
  };

  const Loggined = (email) => {
    mixpanel.track("User Logged In", {
      user_id: email,
      login_method: "Email",
      success: true,
      timestamp: new Date().toISOString(), // ISO 8601 format
    });
    console.log("Login event tracked successfully");
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="login-heading">Login</h2>
        <div className="form-control">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={Inputs.email}
            onChange={change}
          />
          <div className="icon">
            <MdOutlineAlternateEmail />
          </div>
        </div>
        <div className="form-control">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={Inputs.password}
            onChange={change}
          />
          <div className="icon">
            <RiLockPasswordFill />
          </div>
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
        <p className="login-p">
          Don't have an account?
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
