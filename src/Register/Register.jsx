import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import url from "../url.js";
import Swal from "sweetalert";
import mixpanel from "../mixpanel.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const SignUp = () => {
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
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
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
        button: "Try Again",
      });
      return; // Stop the function from proceeding further
    }
    setLoading(true);
    setProgress(0);
    await axios
      .post(`${url}api/v1/register`, Inputs)
      .then((response) => {
        if (response.data.message === "User added") {
          // alert(response.data.message);
          console.log(response.data._id);
          sessionStorage.setItem("id", response.data._id);
          localStorage.setItem("username", Inputs.username);
          console.log(Inputs.username);
          localStorage.setItem("usermail", Inputs.email);
          console.log(Inputs.email);
          setProgress(100);
          setTimeout(() => {
            navigate("/todo");
          }, 500);
          Swal({
            icon: "success",
            title: "Registered Sucessfully.",
            button: "OK",
          });
          // navigate("/todo");

          mixpanel.identify(Inputs.email);

          mixpanel.people.set({
            $name: Inputs.username,
            $email: Inputs.email,
            $created: new Date().toISOString(),
            $user_id: Inputs.email,
            test: "Test",
          });

          Registered(Inputs.email);
        }
        setInputs({
          username: "",
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.response &&
          error.response.data.message === "User already exists"
        ) {
          Swal({
            icon: "error",
            title: "user already exists",
            button: "Try Again",
          });
          // alert("user exists");
          navigate("/login");
        }
      });
  };

  const Registered = (email) => {
    mixpanel.track("User Registered", {
      user_id: email,
      registration_method: "Email",
      success: true,
      timestamp: new Date().toISOString(),
    });
    mixpanel.people.increment("Registrations", 1);
    console.log("Register event tracked successfully");
  };

  return (
    <div>
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
          <h2 className="login-heading">Register</h2>
          <div className="form-control">
            {/* <label>Name:</label> */}
            <input
              type="username"
              name="username"
              onChange={change}
              value={Inputs.username}
              placeholder="Enter your name"
            />
            <div className="icon">
              {" "}
              <IoPerson />
            </div>
          </div>
          <div className="form-control">
            {/* <label>Email:</label> */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={change}
              value={Inputs.email}
            />
            <div className="icon">
              {" "}
              <MdOutlineAlternateEmail />
            </div>
          </div>
          <div className="form-control">
            {/* <label>Password:</label> */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={change}
              value={Inputs.password}
            />
            <div className="icon">
              {" "}
              <RiLockPasswordFill />
            </div>
          </div>
          <button className="login-btn" type="submit">
            Register
          </button>
          <p className="reg-p">
            <br></br>
            Already have an account?
            <Link className="reg-link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
