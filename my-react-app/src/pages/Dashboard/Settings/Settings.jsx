import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    FiUser,
    FiLock,
    FiInfo,
    FiLogOut,
    FiShield,
    FiGlobe,
    FiCheck,
    FiAlertCircle,
    FiEdit3,
    FiServer,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiActivity,
    FiChevronRight,
    FiX,
    FiRefreshCw
} from "react-icons/fi";

import Password from "./Password";
import "./Settings.css";

const API_URL = "http://127.0.0.1:5000";

const Settings = () => {

    // =========================================================
    // PROFILE STATE
    // =========================================================

    const [profile, setProfile] = useState({
        sysID: "",
        systemName: "",
        address: "",
        contactNo: "",
        email: "",
        masterUsername: "",
        publicUsername: "",
        status: "",
        createdDate: ""
    });

    // =========================================================
    // MODAL STATE
    // =========================================================

    const [showProfile, setShowProfile] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // =========================================================
    // LOADING STATE
    // =========================================================

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    // =========================================================
    // MESSAGE STATE
    // =========================================================

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================================================
    // AUTH HEADER
    // =========================================================

    const getHeaders = () => {

        const token = sessionStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    };

    // =========================================================
    // LOAD PROFILE
    // =========================================================

    const loadProfile = async () => {

        try {

            setLoadingProfile(true);
            setError("");

            const systemID =
                sessionStorage.getItem("systemID");

            if (!systemID) {

                setError(
                    "System ID not found. Please login again."
                );

                return;
            }

            const response = await axios.post(
                `${API_URL}/settings/profile`,
                {
                    systemID: systemID
                },
                {
                    headers: getHeaders()
                }
            );

            if (response.data.success) {

                setProfile(
                    response.data.profile
                );

            } else {

                setError(
                    response.data.message ||
                    "Unable to load profile."
                );
            }

        } catch (err) {

            console.error(
                "Load profile error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load profile."
            );

        } finally {

            setLoadingProfile(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadProfile();

    }, []);

    // =========================================================
    // PROFILE INPUT
    // =========================================================

    const handleProfileChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    const updateProfile = async () => {

        setMessage("");
        setError("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!profile.systemName?.trim()) {

            setError(
                "System name is required."
            );

            return;
        }

        if (!profile.address?.trim()) {

            setError(
                "Address is required."
            );

            return;
        }

        if (!profile.contactNo?.trim()) {

            setError(
                "Contact number is required."
            );

            return;
        }

        if (!profile.email?.trim()) {

            setError(
                "Email is required."
            );

            return;
        }

        if (!profile.masterUsername?.trim()) {

            setError(
                "Master username is required."
            );

            return;
        }

        if (!profile.publicUsername?.trim()) {

            setError(
                "Public username is required."
            );

            return;
        }

        try {

            setSavingProfile(true);

            const systemID =
                sessionStorage.getItem("systemID");

            if (!systemID) {

                setError(
                    "System ID not found. Please login again."
                );

                return;
            }

            const response = await axios.put(
                `${API_URL}/settings/profile`,
                {
                    systemID: systemID,
                    systemName:
                        profile.systemName.trim(),
                    address:
                        profile.address.trim(),
                    contactNo:
                        profile.contactNo.trim(),
                    email:
                        profile.email.trim(),
                    masterUsername:
                        profile.masterUsername.trim(),
                    publicUsername:
                        profile.publicUsername.trim()
                },
                {
                    headers: getHeaders()
                }
            );

            if (response.data.success) {

                setMessage(
                    response.data.message ||
                    "Profile updated successfully."
                );

                await loadProfile();

                setTimeout(() => {

                    setShowProfile(false);
                    setMessage("");

                }, 700);

            } else {

                setError(
                    response.data.message ||
                    "Unable to update profile."
                );
            }

        } catch (err) {

            console.error(
                "Update profile error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {

            setSavingProfile(false);
        }
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("systemID");
        sessionStorage.removeItem("sysID");

        window.location.href = "/login";
    };

    // =========================================================
    // CLOSE PROFILE
    // =========================================================

    const closeProfile = () => {

        setShowProfile(false);

        setMessage("");
        setError("");
    };

    // =========================================================
    // OPEN PASSWORD COMPONENT
    // =========================================================

    const openPassword = () => {

        setShowPassword(true);
        setShowProfile(false);

        setMessage("");
        setError("");
    };

    // =========================================================
    // CLOSE PASSWORD COMPONENT
    // =========================================================

    const closePassword = () => {

        setShowPassword(false);
    };

    // =========================================================
    // PASSWORD SUCCESS
    // =========================================================

    const passwordSuccess = (successMessage) => {

        setShowPassword(false);

        setMessage(
            successMessage ||
            "Password updated successfully."
        );
    };

    // =========================================================
    // PASSWORD ERROR
    // =========================================================

    const passwordError = (errorMessage) => {

        setError(
            errorMessage ||
            "Unable to change password."
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="settings-page">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="settings-header">

                <div className="header-content">

                    <div className="header-icon">
                        <FiActivity />
                    </div>

                    <div>

                        <div className="header-title-row">

                            <h1>
                                Settings
                            </h1>

                            {profile.status && (

                                <span
                                    className={
                                        profile.status ===
                                        "active"
                                            ? "system-status active"
                                            : "system-status"
                                    }
                                >

                                    <span className="status-dot"></span>

                                    {profile.status}

                                </span>

                            )}

                        </div>

                        <p>
                            Manage your Tap2Enter
                            system, accounts and
                            security
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="refresh-profile-button"
                    onClick={loadProfile}
                    title="Refresh profile"
                >
                    <FiRefreshCw />
                </button>

            </div>


            {/* =====================================================
                ALERTS
            ===================================================== */}

            {message && (

                <div className="settings-alert success-alert">

                    <div className="alert-icon">
                        <FiCheck />
                    </div>

                    <div>

                        <strong>
                            Success
                        </strong>

                        <span>
                            {message}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setMessage("")
                        }
                        className="alert-close"
                    >
                        <FiX />
                    </button>

                </div>

            )}


            {error && (

                <div className="settings-alert error-alert">

                    <div className="alert-icon">
                        <FiAlertCircle />
                    </div>

                    <div>

                        <strong>
                            Something went wrong
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        className="alert-close"
                    >
                        <FiX />
                    </button>

                </div>

            )}


            {/* =====================================================
                SETTINGS GRID
            ===================================================== */}

            <div className="settings-grid">


                {/* =================================================
                    EDIT PROFILE
                ================================================= */}

                <div className="setting-card profile-card">

                    <div className="card-accent"></div>

                    <div className="card-top">

                        <div className="card-icon profile-icon">
                            <FiUser />
                        </div>

                        <div className="card-title-area">

                            <span className="card-label">
                                SYSTEM
                            </span>

                            <h2>
                                Edit Profile
                            </h2>

                            <p>
                                Update your system and
                                account information
                            </p>

                        </div>

                    </div>

                    <div className="card-divider"></div>

                    <div className="card-options">

                        <div className="option-item">

                            <div className="option-icon">
                                <FiServer />
                            </div>

                            <div>

                                <strong>
                                    System Profile
                                </strong>

                                <span>
                                    System name and address
                                </span>

                            </div>

                            <FiChevronRight />

                        </div>


                        <div className="option-item">

                            <div className="option-icon">
                                <FiShield />
                            </div>

                            <div>

                                <strong>
                                    Master Account
                                </strong>

                                <span>
                                    Administrator account
                                </span>

                            </div>

                            <FiChevronRight />

                        </div>


                        <div className="option-item">

                            <div className="option-icon">
                                <FiGlobe />
                            </div>

                            <div>

                                <strong>
                                    Public Account
                                </strong>

                                <span>
                                    Public dashboard account
                                </span>

                            </div>

                            <FiChevronRight />

                        </div>

                    </div>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => {

                            setShowProfile(true);
                            setShowPassword(false);

                            setMessage("");
                            setError("");

                            loadProfile();

                        }}
                    >

                        <FiEdit3 />

                        Edit Profile

                        <FiChevronRight />

                    </button>

                </div>


                {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

                <div className="setting-card password-card">

                    <div className="card-accent"></div>

                    <div className="card-top">

                        <div className="card-icon password-icon">
                            <FiLock />
                        </div>

                        <div className="card-title-area">

                            <span className="card-label">
                                SECURITY
                            </span>

                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Manage your dashboard
                                passwords securely
                            </p>

                        </div>

                    </div>

                    <div className="card-divider"></div>

                    <div className="card-options">

                        <div className="option-item">

                            <div className="option-icon">
                                <FiShield />
                            </div>

                            <div>

                                <strong>
                                    Master Password
                                </strong>

                                <span>
                                    Administrator access
                                </span>

                            </div>

                            <FiChevronRight />

                        </div>


                        <div className="option-item">

                            <div className="option-icon">
                                <FiGlobe />
                            </div>

                            <div>

                                <strong>
                                    Public Password
                                </strong>

                                <span>
                                    Public dashboard access
                                </span>

                            </div>

                            <FiChevronRight />

                        </div>

                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={openPassword}
                    >

                        <FiLock />

                        Change Password

                        <FiChevronRight />

                    </button>

                </div>


                {/* =================================================
                    SOFTWARE INFORMATION
                ================================================= */}

                <div className="setting-card info-card">

                    <div className="card-accent"></div>

                    <div className="card-top">

                        <div className="card-icon info-icon">
                            <FiInfo />
                        </div>

                        <div className="card-title-area">

                            <span className="card-label">
                                SYSTEM
                            </span>

                            <h2>
                                Software Information
                            </h2>

                            <p>
                                Tap2Enter system information
                            </p>

                        </div>

                    </div>

                    <div className="card-divider"></div>

                    <div className="software-info-box">

                        <div className="software-logo">
                            <FiActivity />
                        </div>

                        <div>

                            <strong>
                                Tap2Enter
                            </strong>

                            <span>
                                Smart Entry System
                            </span>

                        </div>

                    </div>

                    <div className="technology-list">

                        <div>

                            <span>
                                Frontend
                            </span>

                            <strong>
                                React.js
                            </strong>

                        </div>

                        <div>

                            <span>
                                Backend
                            </span>

                            <strong>
                                Flask
                            </strong>

                        </div>

                        <div>

                            <span>
                                Database
                            </span>

                            <strong>
                                MySQL
                            </strong>

                        </div>

                        <div>

                            <span>
                                Security
                            </span>

                            <strong>
                                JWT
                            </strong>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="info-button"
                        onClick={() => {

                            window.alert(
                                "Tap2Enter Smart Entry System\n\n" +
                                "React.js\n" +
                                "Flask\n" +
                                "MySQL\n" +
                                "JWT Authentication"
                            );

                        }}
                    >

                        <FiInfo />

                        View Information

                        <FiChevronRight />

                    </button>

                </div>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <div className="setting-card logout-card">

                    <div className="card-accent"></div>

                    <div className="card-top">

                        <div className="card-icon logout-icon">
                            <FiLogOut />
                        </div>

                        <div className="card-title-area">

                            <span className="card-label">
                                ACCOUNT
                            </span>

                            <h2>
                                Logout
                            </h2>

                            <p>
                                Sign out of your dashboard
                                securely
                            </p>

                        </div>

                    </div>

                    <div className="card-divider"></div>

                    <div className="logout-message">

                        <div className="logout-message-icon">
                            <FiShield />
                        </div>

                        <div>

                            <strong>
                                Secure Logout
                            </strong>

                            <span>
                                Your current dashboard
                                session will be cleared.
                            </span>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >

                        <FiLogOut />

                        Logout

                    </button>

                </div>

            </div>


            {/* =====================================================
                EDIT PROFILE MODAL
            ===================================================== */}

            {showProfile && (

                <div
                    className="settings-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeProfile();
                        }

                    }}
                >

                    <div className="settings-modal profile-modal">

                        {/* HEADER */}

                        <div className="modal-header">

                            <div className="modal-heading">

                                <div className="modal-heading-icon profile-modal-icon">
                                    <FiUser />
                                </div>

                                <div>

                                    <span className="modal-kicker">
                                        SYSTEM SETTINGS
                                    </span>

                                    <h2>
                                        Edit Profile
                                    </h2>

                                    <p>
                                        Update your Tap2Enter
                                        system information
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeProfile}
                            >
                                <FiX />
                            </button>

                        </div>


                        {/* BODY */}

                        {loadingProfile ? (

                            <div className="modal-loading">

                                <div className="loading-spinner"></div>

                                <strong>
                                    Loading profile
                                </strong>

                                <span>
                                    Please wait while your
                                    system information is loaded.
                                </span>

                            </div>

                        ) : (

                            <div className="profile-form">

                                {/* SYSTEM INFORMATION */}

                                <div className="form-section-title">

                                    <FiServer />

                                    <span>
                                        System Information
                                    </span>

                                </div>


                                {/* SYSTEM ID */}

                                <div className="form-group">

                                    <label>
                                        System ID
                                    </label>

                                    <div className="readonly-input">

                                        <FiServer />

                                        <input
                                            type="text"
                                            value={
                                                profile.sysID || ""
                                            }
                                            readOnly
                                        />

                                        <span>
                                            Read only
                                        </span>

                                    </div>

                                </div>


                                {/* SYSTEM NAME */}

                                <div className="form-group">

                                    <label>
                                        System Name
                                    </label>

                                    <div className="input-with-icon">

                                        <FiServer />

                                        <input
                                            type="text"
                                            name="systemName"
                                            value={
                                                profile.systemName || ""
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Enter system name"
                                        />

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="form-group">

                                    <label>
                                        Address
                                    </label>

                                    <div className="input-with-icon">

                                        <FiMapPin />

                                        <input
                                            type="text"
                                            name="address"
                                            value={
                                                profile.address || ""
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Enter system address"
                                        />

                                    </div>

                                </div>


                                {/* CONTACT + EMAIL */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Contact Number
                                        </label>

                                        <div className="input-with-icon">

                                            <FiPhone />

                                            <input
                                                type="text"
                                                name="contactNo"
                                                value={
                                                    profile.contactNo || ""
                                                }
                                                onChange={
                                                    handleProfileChange
                                                }
                                                placeholder="Enter contact number"
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Email
                                        </label>

                                        <div className="input-with-icon">

                                            <FiMail />

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    profile.email || ""
                                                }
                                                onChange={
                                                    handleProfileChange
                                                }
                                                placeholder="Enter email"
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* ACCOUNT SECTION */}

                                <div className="form-section-title account-section-title">

                                    <FiShield />

                                    <span>
                                        Dashboard Accounts
                                    </span>

                                </div>


                                {/* USERNAMES */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Master Username
                                        </label>

                                        <div className="input-with-icon">

                                            <FiShield />

                                            <input
                                                type="text"
                                                name="masterUsername"
                                                value={
                                                    profile.masterUsername || ""
                                                }
                                                onChange={
                                                    handleProfileChange
                                                }
                                                placeholder="Master username"
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Public Username
                                        </label>

                                        <div className="input-with-icon">

                                            <FiGlobe />

                                            <input
                                                type="text"
                                                name="publicUsername"
                                                value={
                                                    profile.publicUsername || ""
                                                }
                                                onChange={
                                                    handleProfileChange
                                                }
                                                placeholder="Public username"
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* STATUS + CREATED DATE */}

                                <div className="view-info">

                                    <div className="status-info-box">

                                        <span>
                                            <FiActivity />
                                            Status
                                        </span>

                                        <strong>

                                            <i
                                                className={
                                                    profile.status ===
                                                    "active"
                                                        ? "status-indicator active"
                                                        : "status-indicator"
                                                }
                                            ></i>

                                            {profile.status ||
                                                "N/A"}

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            <FiCalendar />
                                            Created Date
                                        </span>

                                        <strong>
                                            {profile.createdDate ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                </div>


                                {/* ACTIONS */}

                                <div className="modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={closeProfile}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="save-button"
                                        onClick={updateProfile}
                                        disabled={
                                            savingProfile
                                        }
                                    >

                                        {savingProfile ? (

                                            <>
                                                <span className="button-spinner"></span>
                                                Saving...
                                            </>

                                        ) : (

                                            <>
                                                <FiCheck />
                                                Save Changes
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}


            {/* =====================================================
                PASSWORD COMPONENT
            ===================================================== */}

            {showPassword && (

                <Password
                    onClose={closePassword}
                    onSuccess={passwordSuccess}
                    onError={passwordError}
                />

            )}


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="settings-footer">

                <div className="footer-line"></div>

                <span>
                    © 2026 Tap2Enter Smart Entry System
                </span>

                <span className="footer-secure">

                    <FiShield />

                    Secure System

                </span>

                <div className="footer-line"></div>

            </div>

        </div>
    );
};

export default Settings;