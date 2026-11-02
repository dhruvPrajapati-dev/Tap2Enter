import React, { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const AdminDashboard = () => {
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showConfirmMasterPassword, setShowConfirmMasterPassword] = useState(false);
  const [showPublicPassword, setShowPublicPassword] = useState(false);
  const [showConfirmPublicPassword, setShowConfirmPublicPassword] = useState(false);

  const [formData, setFormData] = useState({
    systemName: "",
    address: "",
    contactNo: "",
    email: "",
    masterUsername: "",
    masterPassword: "",
    confirmMasterPassword: "",
    publicUsername: "",
    publicPassword: "",
    confirmPublicPassword: "",
    status: "Active",
  });

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.masterUsername.startsWith("mst_")) {
    alert("Master Username must start with 'mst_'");
    return;
  }

  if (!formData.publicUsername.startsWith("pub_")) {
    alert("Public Username must start with 'pub_'");
    return;
  }

  if (
    formData.masterPassword !==
    formData.confirmMasterPassword
  ) {
    alert("Master Password does not match");
    return;
  }

  if (
    formData.publicPassword !==
    formData.confirmPublicPassword
  ) {
    alert("Public Password does not match");
    return;
  }

  // Axios API call...




    try {

        // ============================
        // Get JWT Token
        // ============================

        const token = sessionStorage.getItem("token");

        if (!token) {

            alert("Session Expired. Please login again.");

            navigate("/admin");

            return;

        }

        // ============================
        // Send Request
        // ============================

        const response = await axios.post(

            "http://127.0.0.1:5000/admin/add-system",

            {
                systemName: formData.systemName,
                address: formData.address,
                contactNo: formData.contactNo,
                email: formData.email,
                masterUsername: formData.masterUsername,
                masterPassword: formData.masterPassword,
                publicUsername: formData.publicUsername,
                publicPassword: formData.publicPassword,
                status: formData.status
            },

            {
                headers: {

                    Authorization: `Bearer ${token}`,

                    "Content-Type": "application/json"

                }

            }

        );

        // ============================
        // Success
        // ============================

        alert(response.data.message);

        setFormData({

            systemName: "",
            address: "",
            contactNo: "",
            email: "",
            masterUsername: "",
            masterPassword: "",
            confirmMasterPassword: "",
            publicUsername: "",
            publicPassword: "",
            confirmPublicPassword: "",
            status: "Active"

        });

    }

    catch (error) {

        console.log(error);

        if (error.response) {

            alert(error.response.data.message);

        }

        else {

            alert("Unable to connect to Flask Server.");

        }

    }

};


// =======================================
// Logout
// =======================================

const handleLogout = () => {

    sessionStorage.clear();

    navigate("/admin");

};

  return (
    <div className="add-system-page">
<button onClick={handleLogout}>
    Logout
</button>
      <div className="system-card">

        <h2>Add New System</h2>

        <form onSubmit={handleSubmit}>

          {/* System Information */}

          <div className="section-title">
            System Information
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>System Name *</label>
              <input
                type="text"
                name="systemName"
                placeholder="Enter System Name"
                value={formData.systemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNo"
                placeholder="Enter Contact Number"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              rows="3"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

          </div>

          {/* Master Login */}

          <div className="section-title">
            Master Login Credentials
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Master Username</label>

          <input
  type="text"
  name="masterUsername"
  placeholder="mst_username"
  value={formData.masterUsername}
  onChange={handleChange}
  required
/>
            </div>

            <div className="form-group password-group">

              <label>Master Password *</label>

              <input
                type={
                  showMasterPassword
                    ? "text"
                    : "password"
                }
                name="masterPassword"
                placeholder="Password"
                value={formData.masterPassword}
                onChange={handleChange}
                required
              />

              <span
                className="eye"
                onClick={() =>
                  setShowMasterPassword(
                    !showMasterPassword
                  )
                }
              >
                {showMasterPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

            <div className="form-group password-group">

              <label>Confirm Password *</label>

              <input
                type={
                  showConfirmMasterPassword
                    ? "text"
                    : "password"
                }
                name="confirmMasterPassword"
                placeholder="Confirm Password"
                value={formData.confirmMasterPassword}
                onChange={handleChange}
                required
              />

              <span
                className="eye"
                onClick={() =>
                  setShowConfirmMasterPassword(
                    !showConfirmMasterPassword
                  )
                }
              >
                {showConfirmMasterPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

          </div>

          {/* Public Login */}

          <div className="section-title">
            Public Login Credentials
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Public Username</label>
<input
  type="text"
  name="publicUsername"
  placeholder="pub_username"
  value={formData.publicUsername}
  onChange={handleChange}
  required
/>
            </div>

            <div className="form-group password-group">

              <label>Public Password *</label>

              <input
                type={
                  showPublicPassword
                    ? "text"
                    : "password"
                }
                name="publicPassword"
                placeholder="Public Password"
                value={formData.publicPassword}
                onChange={handleChange}
                required
              />

              <span
                className="eye"
                onClick={() =>
                  setShowPublicPassword(
                    !showPublicPassword
                  )
                }
              >
                {showPublicPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

            <div className="form-group password-group">

              <label>Confirm Password *</label>

              <input
                type={
                  showConfirmPublicPassword
                    ? "text"
                    : "password"
                }
                name="confirmPublicPassword"
                placeholder="Confirm Password"
                value={formData.confirmPublicPassword}
                onChange={handleChange}
                required
              />

              <span
                className="eye"
                onClick={() =>
                  setShowConfirmPublicPassword(
                    !showConfirmPublicPassword
                  )
                }
              >
                {showConfirmPublicPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

          </div>

          <div className="button-group">

            <button
              type="submit"
              className="save-btn"
            >
              Save System
            </button>

            <button
              type="reset"
              className="reset-btn"
            >
              Reset
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AdminDashboard;