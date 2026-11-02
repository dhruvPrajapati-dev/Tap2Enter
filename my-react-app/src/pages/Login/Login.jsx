import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import {
  FaUsers,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

/* ---------------- Input ---------------- */

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="input-wrapper">
      <input className="input" {...props} />
      <Icon className="input-icon" size={18} />
    </div>
  );
}

/* ---------------- Button ---------------- */

function LoginButton({ children, ...props }) {
  return (
    <button className="login-button" {...props}>
      {children}
    </button>
  );
}

/* ---------------- Login Form ---------------- */

function LoginForm() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter Username and Password.");
      return;
    }

    setLoading(true);

    try {

      console.log("Sending Login Request...");

      const response = await axios.post(
        "http://127.0.0.1:5000/user/login",
        {
          username,
          password,
        }
      );

      console.log("Backend Response:", response.data);

      if (response.data.success) {

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("systemID", response.data.systemID);
        sessionStorage.setItem("systemName", response.data.systemName);

        console.log("Token Saved:", sessionStorage.getItem("token"));

        if (response.data.role === "master") {

          navigate("/master/dashboard");

        } else if (response.data.role === "public") {

          navigate("/public/dashboard");

        } else {

          setError("Invalid user role.");

        }

      } else {

        setError(response.data.message);

      }

    } catch (err) {

      console.log(err);

      if (err.response) {

        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);

        setError(
          err.response.data.message || "Login Failed."
        );

      } else {

        setError("Unable to connect to Flask Server.");

      }

    } finally {

      setLoading(false);

    }

  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >

      <InputField
        icon={FaUsers}
        type="text"
        placeholder="Username"
        value={username}
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <InputField
        icon={FaLock}
        type="password"
        placeholder="Password"
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <LoginButton
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging In..." : "Login"}
      </LoginButton>

    </form>
  );
}

/* ---------------- Right Side ---------------- */

function WelcomePanel() {
  return (
    <div className="welcome-panel">

      <div className="welcome-content">

        <h2 className="welcome-title">
          WELCOME BACK!
        </h2>

        <p className="welcome-text">
          Tap in, sign in and manage attendance
          in real time.
        </p>

      </div>

    </div>
  );
}

/* ---------------- Main Page ---------------- */

export default function Login() {

  return (

    <div className="admin-login-container">

      <div className="left-section">

        <div className="login-card">

          <div className="admin-logo">
            <FaUserShield size={28} />
          </div>

          <h1 className="login-heading">
            User Login
          </h1>

          <LoginForm />

        </div>

      </div>

      <WelcomePanel />

    </div>

  );

}