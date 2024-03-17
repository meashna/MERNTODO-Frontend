import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import url from "../url.js";
import Swal from "sweetalert";

const Login = () => {
  const [Inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const change = (e) => {
    //console.log(e.target.name, e.target.value);
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
      return; // Stop the function from proceeding further
    }
    await axios
      .post(`${url}api/v1/signin`, Inputs)
      .then((response) => {
        console.log(response.data._id);
        //console.log(response.data.message);
        sessionStorage.setItem("id", response.data._id);
        const username = response.data.username;
        localStorage.setItem("username", username);
        Swal({
          icon: "success",
          title: "Loggined Sucessfully.",
          button: "OK",
        });
        navigate("/todo");
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
        } else {
          Swal({
            icon: "error",
            title: "User not found. Please check your email address.",
            button: "Try Again",
          });
        }
      });
  };
  return (
    <div>
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
              {" "}
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
    </div>
  );
};

export default Login;
