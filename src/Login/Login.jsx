import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";
import url from "../url.js";
import mixpanel from "../mixpanel.js";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          const diff = Math.random() * 10;
          return Math.min(prevProgress + diff, 100);
        });
      }, 500);
    }
    return () => {
      clearInterval(timer);
    };
  }, [loading]);

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

    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.post(`${url}api/v1/signin`, Inputs);

      setProgress(100);
      setTimeout(() => {
        navigate("/todo");
      }, 500);

      sessionStorage.setItem("id", response.data._id);

      const username = response.data.username;
      const usermail = response.data.email;

      localStorage.setItem("username", username);
      localStorage.setItem("usermail", usermail);

      console.log(username);
      console.log(usermail);

      Swal({
        icon: "success",
        title: "Logged In Successfully.",
        button: "OK",
      });

      Loggined(usermail);

      mixpanel.identify(usermail);

      mixpanel.people.set({
        $name: username,
        $email: usermail,
        $created: new Date().toISOString(),
        $user_id: usermail,
        test: "Test",
      });
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.message === "User not found.") {
        Swal({
          icon: "error",
          title: "User not found. Please check your email address.",
          button: "Try Again",
        });
      }
    }
  };

  const Loggined = (email) => {
    mixpanel.track("User Logged In", {
      user_id: email,
      login_method: "Email",
      success: true,
      timestamp: new Date().toISOString(), // ISO 8601 format
    });
    mixpanel.people.increment("Logins", 1);
    console.log("Login event tracked successfully");
  };

  return (
    <div className="form-container">
      {loading ? (
        <div className="loader-container">
          <CircularProgressbar
            value={progress}
            text={`${progress.toFixed(0)}%`}
            styles={{
              text: {
                fill: "#ffff",
              },
              trail: {
                stroke: "#ffff",
              },
              path: {
                stroke: "458393",
                strokeLinecap: "round",
              },
            }}
          />
        </div>
      ) : (
        <div className="loader-container" style={{ display: "none" }}>
          <CircularProgressbar value={progress} text={`${progress}%`} />
        </div>
      )}
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
