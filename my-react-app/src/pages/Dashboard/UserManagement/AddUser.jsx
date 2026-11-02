import "./AddUser.css";
import { useState } from "react";
import axios from "axios";

import {
  FaArrowLeft,
  FaUserPlus,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWifi,
  FaCamera,
  FaUpload,
  FaSyncAlt,
  FaSave,
  FaTimes
} from "react-icons/fa";

function AddUser({ onClose }) {

  // ============================
  // State
  // ============================

  const [formData, setFormData] = useState({

    fullName: "",
    contactNo: "",
    email: "",
    NFCID: "",

    photo: null,
    faceImage: null,

    status: "Active"

  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================
  // Input Change
  // ============================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  // ============================
  // Submit
  // ============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const token = sessionStorage.getItem("token");

      if (!token) {

        alert("Please login again.");

        setLoading(false);

        return;

      }

      console.log("Sending Data :", formData);

      const response = await axios.post(

        "http://127.0.0.1:5000/system/add-user",

        {

          fullName: formData.fullName,

          contactNo: formData.contactNo,

          email: formData.email,

          NFCID: formData.NFCID,

          status: formData.status

        },

        {

          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

          }

        }

      );

      console.log(response.data);

      alert(response.data.message);

      setFormData({

        fullName: "",

        contactNo: "",

        email: "",

        NFCID: "",

        photo: null,

        faceImage: null,

        status: "Active"

      });

    }

    catch (err) {

      console.error(err);

      setError(

        err.response?.data?.message ||

        "Unable to connect to Backend."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

<div className="addUserPage">

    {/* Header */}

    <div className="addHeader">

        <div className="leftHeader">

            <button
                className="backBtn"
                onClick={onClose}
            >
                <FaArrowLeft />
            </button>

            <div>

                <h2>

                    <FaUserPlus className="titleIcon" />

                    Add New User

                </h2>

                <p>

                    Register a new user in the system

                </p>

            </div>

        </div>

        <div className="breadcrumb">

            <p>Master Dashboard {">"} Users {">"} Add User</p>

        </div>

    </div>

    {/* Error */}

    {

        error && (

            <div className="errorBox">

                {error}

            </div>

        )

    }

    {/* Form */}

    <form onSubmit={handleSubmit}>

        <div className="addCard">

            {/* ======================= */}
            {/* Personal Information */}
            {/* ======================= */}

            <h3 className="sectionTitle">

                Personal Information

            </h3>

            <div className="formGrid">

                {/* Full Name */}

                <div className="formGroup fullWidth">

                    <label>

                        Full Name <span>*</span>

                    </label>

                    <div className="inputBox">

                        <FaUser />

                        <input

                            type="text"

                            name="fullName"

                            placeholder="Enter Full Name"

                            value={formData.fullName}

                            onChange={handleChange}

                            required

                        />

                    </div>

                </div>

                {/* Contact */}

                <div className="formGroup">

                    <label>

                        Contact Number <span>*</span>

                    </label>

                    <div className="inputBox">

                        <FaPhone />

                        <input

                            type="text"

                            name="contactNo"

                            placeholder="Enter Contact Number"

                            value={formData.contactNo}

                            onChange={handleChange}

                            required

                        />

                    </div>

                </div>

                {/* Email */}

                <div className="formGroup">

                    <label>

                        Email Address

                    </label>

                    <div className="inputBox">

                        <FaEnvelope />

                        <input

                            type="email"

                            name="email"

                            placeholder="Enter Email"

                            value={formData.email}

                            onChange={handleChange}

                        />

                    </div>

                </div>

            </div>

            {/* ======================= */}
            {/* NFC */}
            {/* ======================= */}

            <h3 className="sectionTitle">

                NFC Information

            </h3>

            <div className="nfcSection">

                <div className="formGroup nfcInput">

                    <label>

                        NFC Card UID

                    </label>

                    <div className="inputBox">

                        <FaWifi />

                        <input

                            type="text"

                            name="NFCID"

                            placeholder="Tap Card or Enter UID"

                            value={formData.NFCID}

                            onChange={handleChange}

                            required

                        />

                    </div>

                </div>

                <button

                    type="button"

                    className="scanBtn"

                >

                    <FaWifi />

                    Scan NFC Card

                </button>

            </div>

            {/* ======================= */}
            {/* Upload Section */}
            {/* ======================= */}

            <div className="uploadSection">

                {/* Photo */}

                <div className="uploadCard">

                    <h3>

                        User Photo

                    </h3>

                    <div className="uploadBox">

                        <div className="uploadIcon">

                            <FaUser />

                        </div>

                        <h4>

                            No Photo Selected

                        </h4>

                        <div className="uploadBtns">

                            <button

                                type="button"

                                className="primaryBtn"

                            >

                                <FaCamera />

                                Capture Photo

                            </button>

                            <button

                                type="button"

                                className="secondaryBtn"

                            >

                                <FaUpload />

                                Upload Photo

                            </button>

                        </div>

                        <p>

                            JPG, PNG or JPEG

                        </p>

                    </div>

                </div>

                {/* Face Registration */}

                <div className="uploadCard">

                    <h3>

                        Face Registration

                    </h3>

                    <div className="uploadBox">

                        <div className="faceIcon">

                            <FaCamera />

                        </div>

                        <h4>

                            Face Not Registered

                        </h4>

                        <div className="uploadBtns">

                            <button

                                type="button"

                                className="primaryBtn"

                            >

                                <FaCamera />

                                Register Face

                            </button>

                            <button

                                type="button"

                                className="secondaryBtn"

                            >

                                <FaSyncAlt />

                                Capture Again

                            </button>

                        </div>

                        <p>

                            Make sure your face is clearly visible

                        </p>

                    </div>

                </div>

            </div>

                        {/* ============================= */}
            {/* Footer Buttons */}
            {/* ============================= */}

        </div>

        <div className="footerBtns">

            <button
                type="button"
                className="cancelBtn"
                onClick={onClose}
            >
                <FaTimes />
                Cancel
            </button>

            <button
                type="reset"
                className="resetBtn"
                onClick={() =>
                    setFormData({
                        fullName: "",
                        contactNo: "",
                        email: "",
                        NFCID: "",
                        photo: null,
                        faceImage: null,
                        status: "Active"
                    })
                }
            >
                <FaSyncAlt />
                Reset
            </button>

            <button
                type="submit"
                className="saveBtn"
                disabled={loading}
            >
                <FaSave />

                {loading ? "Saving..." : "Save User"}

            </button>

        </div>

    </form>

</div>

);

}

export default AddUser;