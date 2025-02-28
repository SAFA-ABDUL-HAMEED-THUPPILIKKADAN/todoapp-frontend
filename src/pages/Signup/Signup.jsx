import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [userExists, setUserExists] = useState("");

  const storeData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      // Show success message
      toast.success("User Created Successfully!", {
        autoClose: 3000, // Toast will disappear after 3 seconds
        onClose: () => {
          // Navigate to login after toast closes
          navigate("/login");
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If email is already registered, show the specific error message
        toast.error(
          error.response.data.detail ||
            "Something went wrong. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        // Show a generic error message if something else goes wrong
        toast.error("Signup failed. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      console.error("Signup Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.formContainer}>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => {
            setUserData({ ...userData, name: e.target.value });
          }}
          required
          placeholder="Enter Your Full Name"
          className={styles.userFullNameInput}
        />

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

        <button onClick={storeData} className={styles.submitButton}>
          Signup
        </button>
      </div>
      <Link className={styles.link} to="/login">
        <p>Already have an account? Login Now!</p>
      </Link>
      <div className={styles.error}>{userExists}</div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
