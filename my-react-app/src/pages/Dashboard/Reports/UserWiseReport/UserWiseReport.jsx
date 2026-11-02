import React, { useState } from "react";
import axios from "axios";

import "./UserWiseReport.css";

import {
    FaUser,
    FaSearch,
    FaCalendarAlt,
    FaFileAlt,
    FaSyncAlt,
    FaArrowLeft,
    FaTimesCircle,
    FaSpinner
} from "react-icons/fa";

import UserInfoCard from "./UserInfoCard";
import UserReportSummary from "./UserReportSummary";
import UserAttendanceTable from "./UserAttendanceTable";

const API_URL = "http://127.0.0.1:5000";

function UserWiseReport({ onClose }) {

    // =====================================================
    // STATES
    // =====================================================

    const [searchUser, setSearchUser] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [showReport, setShowReport] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [summary, setSummary] = useState(null);

    const [attendance, setAttendance] = useState([]);


    // =====================================================
    // GET TODAY DATE
    // =====================================================

    const getTodayDate = () => {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // =====================================================
    // GENERATE REPORT
    // =====================================================

    const handleGenerate = async () => {

        setError("");

        // -----------------------------------------------
        // Validation
        // -----------------------------------------------

        if (searchUser.trim() === "") {

            setError("Please enter Employee ID, Name, NFC ID or Mobile Number.");

            return;
        }

        if (fromDate === "") {

            setError("Please select From Date.");

            return;
        }

        if (toDate === "") {

            setError("Please select To Date.");

            return;
        }

        if (fromDate > toDate) {

            setError("From Date cannot be greater than To Date.");

            return;
        }


        // -----------------------------------------------
        // Session Data
        // -----------------------------------------------

        const token =
            sessionStorage.getItem("token");

        const sysID =
            sessionStorage.getItem("systemID");


        if (!token) {

            setError("Authentication token not found. Please login again.");

            return;
        }

        if (!sysID) {

            setError("System ID not found. Please login again.");

            return;
        }


        // -----------------------------------------------
        // API Request
        // -----------------------------------------------

        try {

            setLoading(true);

            setShowReport(false);

            const response = await axios.get(
                `${API_URL}/public/user-wise-report`,
                {
                    params: {
                        sysID: sysID,
                        search: searchUser.trim(),
                        fromDate: fromDate,
                        toDate: toDate
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // -------------------------------------------
            // API Response
            // -------------------------------------------

            if (
                !response.data ||
                response.data.success !== true
            ) {

                throw new Error(
                    response.data?.message ||
                    "Unable to generate user report."
                );
            }


            // -------------------------------------------
            // Set User
            // -------------------------------------------

            setSelectedUser(
                response.data.user || null
            );


            // -------------------------------------------
            // Set Summary
            // -------------------------------------------

            setSummary(
                response.data.summary || {
                    totalEntries: 0,
                    totalExit: 0,
                    presentDays: 0,
                    workingHours: "0 Hrs",
                    nfcEntries: 0,
                    faceEntries: 0
                }
            );


            // -------------------------------------------
            // Set Attendance
            // -------------------------------------------

            setAttendance(
                response.data.attendance || []
            );


            // -------------------------------------------
            // Show Report
            // -------------------------------------------

            setShowReport(true);

        } catch (err) {

            console.error(
                "User Wise Report Error:",
                err
            );

            setSelectedUser(null);

            setSummary(null);

            setAttendance([]);

            setShowReport(false);


            // -------------------------------------------
            // Error Message
            // -------------------------------------------

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    "Unable to generate report."
                );

            } else {

                setError(
                    err.message ||
                    "Unable to connect to server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setSearchUser("");

        setFromDate("");

        setToDate("");

        setSelectedUser(null);

        setSummary(null);

        setAttendance([]);

        setError("");

        setShowReport(false);

        setLoading(false);
    };


    // =====================================================
    // CLEAR ERROR
    // =====================================================

    const clearError = () => {

        setError("");
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="userWisePage">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="pageHeader">

                <div className="headerLeft">

                    {/* Back Button */}

                    <button
                        type="button"
                        className="backButton"
                        onClick={onClose}
                        title="Back to Reports"
                    >
                        <FaArrowLeft />
                    </button>


                    {/* Header Icon */}

                    <div className="headerIcon">
                        <FaUser />
                    </div>


                    {/* Header Text */}

                    <div className="headerText">

                        <h2>
                            User-wise Report
                        </h2>

                        <p>
                            View detailed attendance report of a registered user
                        </p>

                    </div>

                </div>


                {/* Breadcrumb */}

                <div className="breadcrumb">

                    Reports
                    <span> &gt; </span>
                    User-wise Report

                </div>

            </div>


            {/* =================================================
                SEARCH / FILTER CARD
            ================================================= */}

            <div className="searchCard">

                {/* Card Heading */}

                <div className="searchCardHeader">

                    <div>

                        <h3>
                            Generate User Report
                        </h3>

                        <p>
                            Search a user and select the attendance period
                        </p>

                    </div>

                    <div className="reportIcon">
                        <FaFileAlt />
                    </div>

                </div>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="reportError">

                        <FaTimesCircle />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={clearError}
                            title="Close"
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <div className="formGrid">


                    {/* =============================================
                        SEARCH USER
                    ============================================== */}

                    <div className="formGroup fullWidth">

                        <label>
                            Search User
                            <span className="required">
                                *
                            </span>
                        </label>

                        <div className="searchBox">

                            <FaSearch />

                            <input
                                type="text"
                                value={searchUser}
                                placeholder="Search by Employee ID, Name, NFC UID or Mobile Number"
                                onChange={(e) =>
                                    setSearchUser(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {

                                    if (
                                        e.key === "Enter"
                                    ) {
                                        handleGenerate();
                                    }

                                }}
                            />

                        </div>

                    </div>


                    {/* =============================================
                        FROM DATE
                    ============================================== */}

                    <div className="formGroup">

                        <label>
                            From Date
                            <span className="required">
                                *
                            </span>
                        </label>

                        <div className="inputBox">

                            <FaCalendarAlt />

                            <input
                                type="date"
                                value={fromDate}
                                max={toDate || getTodayDate()}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =============================================
                        TO DATE
                    ============================================== */}

                    <div className="formGroup">

                        <label>
                            To Date
                            <span className="required">
                                *
                            </span>
                        </label>

                        <div className="inputBox">

                            <FaCalendarAlt />

                            <input
                                type="date"
                                value={toDate}
                                min={fromDate || undefined}
                                max={getTodayDate()}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BUTTON AREA
                ================================================= */}

                <div className="buttonArea">

                    {/* Generate */}

                    <button
                        type="button"
                        className="generateBtn"
                        onClick={handleGenerate}
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <FaSpinner className="spinIcon" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <FaFileAlt />
                                Generate Report
                            </>
                        )}

                    </button>


                    {/* Reset */}

                    <button
                        type="button"
                        className="resetBtn"
                        onClick={handleReset}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        Reset

                    </button>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="reportLoading">

                    <FaSpinner className="spinIcon" />

                    <span>
                        Generating user attendance report...
                    </span>

                </div>

            )}


            {/* =================================================
                REPORT RESULT
            ================================================= */}

            {showReport && selectedUser && (

                <div className="reportResult">


                    {/* =============================================
                        USER INFORMATION
                    ============================================== */}

                    <UserInfoCard
                        user={selectedUser}
                    />


                    {/* =============================================
                        SUMMARY
                    ============================================== */}

                    <UserReportSummary
                        summary={summary}
                    />


                    {/* =============================================
                        ATTENDANCE
                    ============================================== */}

                    <UserAttendanceTable
                        attendance={attendance}
                    />

                </div>

            )}


            {/* =================================================
                NO DATA
            ================================================= */}

            {showReport && !selectedUser && (

                <div className="noReport">

                    <FaUser />

                    <h3>
                        No User Found
                    </h3>

                    <p>
                        No registered user matched your search.
                    </p>

                </div>

            )}

        </div>
    );
}

export default UserWiseReport;