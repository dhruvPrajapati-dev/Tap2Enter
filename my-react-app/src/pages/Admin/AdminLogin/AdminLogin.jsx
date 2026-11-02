import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import axios from "axios";
import {
  FaUsers,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

/* ---------------- Reusable Components ---------------- */

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="input-wrapper">
      <input className="input" {...props} />
      <Icon size={18} className="input-icon" />
    </div>
  );
}

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

    try {

       const response =  await axios.post(
    "http://127.0.0.1:5000/admin/login",
    {
        username,
        password,
    }
);

         if (response.data.success) {
              sessionStorage.setItem("token", response.data.token);

            sessionStorage.setItem(
                "role",
                response.data.role
            );

            sessionStorage.setItem(
                "adminID",
                response.data.adminID
            );

            sessionStorage.setItem(
                "username",
                response.data.username
            );

            sessionStorage.setItem(
                "fullName",
                response.data.fullName
            );

            navigate("/admin/dashboard");

        }

    } catch (error) {

        if (error.response) {

            setError(error.response.data.message);

        } else {

            setError("Unable to connect to Flask Server.");

        }
 setLoading(false);
    }

};

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>

      <InputField
        icon={FaUsers}
        type="text"
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <InputField
        icon={FaLock}
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
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
        {loading ? "Logging in..." : "Login"}
      </LoginButton>

      <a href="#" className="forgot-link">
        Forgot Password?
      </a>

    </form>
  );
}

/* ---------------- Welcome Panel ---------------- */

function WelcomePanel() {
  return (
    <div className="welcome-panel">
      <div className="welcome-content">

        <h2 className="welcome-title">
          WELCOME
          <br />
          ADMIN
        </h2>

        <p className="welcome-text">
          Manage users, monitor NFC Entry & Exit logs,
          and control building access from the Tap2Enter
          Admin Console.
        </p>

      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */

export default function AdminLogin() {
  return (
    <div className="admin-login-container">

      <div className="left-section">

        <div className="login-card">

          <div className="admin-logo">
            <FaUserShield size={28} />
          </div>

          <h1 className="login-heading">
            Admin Login
          </h1>

          <LoginForm />

        </div>

      </div>

      <WelcomePanel />

    </div>
  );
}