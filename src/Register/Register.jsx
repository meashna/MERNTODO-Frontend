import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import url from "../url.js";

const SignUp = () => {
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

    await axios
      .post(`${url}/api/v1/register`, Inputs)
      .then((response) => {
        if (response.data.message === "User added") {
          alert(response.data.message);
          console.log(response.data._id);
          sessionStorage.setItem("id", response.data._id);
          localStorage.setItem("username", Inputs.username);
          navigate("/todo");
        }
        setInputs({
          username: "",
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message === "User already exists"
        ) {
          alert("user exists");
          navigate("/login");
        }
      });
  };
  return (
    <div>
      <div className="form-container">
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
