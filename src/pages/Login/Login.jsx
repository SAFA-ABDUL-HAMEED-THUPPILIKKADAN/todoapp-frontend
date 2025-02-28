import React, { useEffect, useState } from "react";
import styles from "../Signup/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login", // Your login API endpoint
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token); // Store the token in localStorage
        navigate("/todo");
      }
    } catch (error) {
      // Handle errors here
      if (error.response) {
        if (error.response.data.email) {
          setErrorMessage("Email does not exist");
        } else if (error.response.data.password) {
          setErrorMessage("Incorrect password");
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.formContainer}>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
          }}
          required
          placeholder="Enter Your Email Address"
          className={styles.userEmailInput}
        />

        <input
          type="password"
          value={userData.password}
          onChange={(e) => {
            setUserData({ ...userData, password: e.target.value });
          }}
          required
          placeholder="Enter Your Account Password"
          className={styles.userPasswordInput}
        />

        <button onClick={loginUser} className={styles.submitButton}>
          Login
        </button>
      </div>
      <Link className={styles.link} to="/signup">
        <p>Don't have an account? Signup Now!</p>
      </Link>
      <div className={styles.error}>{errorMessage}</div>
    </div>
  );
};

export default Login;
