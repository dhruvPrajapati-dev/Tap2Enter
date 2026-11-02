import React, { useState } from "react";
import AdminLogin from "./AdminLogin";




/**
 * AdminPage
 * Handles the "navigate to dashboard on success" behavior locally so
 * this demo has no router dependency. In a real app, swap setLoggedIn
 * for a real navigate("/admin/dashboard") call (react-router, etc.).
 */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08070D",
          color: "#FFFFFF",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textAlign: "center",
          gap: 8,
        }}
      >
        <h1>Welcome to the Admin Dashboard</h1>
        <p style={{ color: "#C9C9D1" }}>You're logged in as the Tap2Enter administrator.</p>
      </div>
    );
  }

  return <AdminLogin onLoginSuccess={() => setLoggedIn(true)} />;
}
