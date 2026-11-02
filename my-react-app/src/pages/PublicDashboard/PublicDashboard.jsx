import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  FiClock,
  FiUser,
  FiCamera,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiCast,
  FiRadio,
} from "react-icons/fi";

import Visitor from "./Visitor";
import "./PublicDashboard.css";

const PublicDashboard = () => {
  // =====================================================
  // PAGE STATE
  // =====================================================

  const [isVisitor, setIsVisitor] = useState(false);

  // =====================================================
  // NFC STATE
  // =====================================================

  const [nfcId, setNfcId] = useState("");
  const [nfcStatus, setNfcStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // FACE STATE
  // =====================================================

  const [faceDetected, setFaceDetected] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // =====================================================
  // ATTENDANCE SUCCESS
  // =====================================================

  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const [attendanceType, setAttendanceType] = useState("");
  const [userName, setUserName] = useState("");
  const [successTime, setSuccessTime] = useState("");

  // =====================================================
  // CURRENT DATE / TIME
  // =====================================================

  const [currentTime, setCurrentTime] = useState(new Date());

  // =====================================================
  // REAL TIME CLOCK
  // =====================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =====================================================
  // CAMERA
  // =====================================================

  useEffect(() => {
    if (isVisitor) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isVisitor]);

  // =====================================================
  // START CAMERA
  // =====================================================

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error("Camera API is not supported by this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);

      if (error.name === "NotAllowedError") {
        console.error("Camera permission was denied.");
      } else if (error.name === "NotFoundError") {
        console.error("No camera was found.");
      }
    }
  };

  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // =====================================================
  // TIME
  // =====================================================

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // =====================================================
  // NFC ATTENDANCE SUBMIT
  // =====================================================

  const handleNfcSubmit = async () => {
    if (nfcId.trim() === "") {
      alert("Please Enter NFC Card UID");
      return;
    }

    try {
      setLoading(true);
      setNfcStatus(false);
      setAttendanceSuccess(false);

      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:5000/public/attendance",
        {
          NFCID: nfcId.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Attendance Response:", response.data);

      if (response.data.success) {
        setAttendanceSuccess(true);

        setUserName(response.data.fullName || "User");

        setAttendanceType(
          response.data.type ||
            response.data.attendanceType ||
            "entry"
        );

        setSuccessTime(
          response.data.time ||
            new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
        );

        setNfcStatus(true);
        setNfcId("");
      } else {
        alert(response.data.message || "Attendance failed.");
      }
    } catch (error) {
      console.error("Attendance Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Attendance request failed."
        );
      } else if (error.request) {
        alert("Unable to connect to Flask Server.");
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VISITOR PAGE
  // =====================================================

  const handleVisitor = () => {
    stopCamera();
    setIsVisitor(true);
  };

  // =====================================================
  // BACK FROM VISITOR
  // =====================================================

  const handleBackFromVisitor = () => {
    setIsVisitor(false);
  };

  // =====================================================
  // VISITOR PAGE
  // =====================================================

  if (isVisitor) {
    return (
      <Visitor
        onBack={handleBackFromVisitor}
      />
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="attendance-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="attendance-header">

        {/* BRAND */}

        <div className="brand-section">

          <div className="logo-icon">
            <img
              src="/src/assets/logo.svg"
              alt="Tap2Enter Logo"
            />
          </div>

          <div className="brand-text">

            <h2>Tap2Enter</h2>

            <span>
              Smart Attendance System
            </span>

          </div>

        </div>

        {/* HEADER RIGHT */}

        <div className="header-right">

          <div className="header-time">

            <FiClock />

            <span>
              {formattedDate} | {formattedTime}
            </span>

          </div>

          <button
            type="button"
            className="visitor-button"
            onClick={handleVisitor}
          >
            <FiUser />

            I'm Visitor
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="attendance-container">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="page-title">

          <div className="title-line"></div>

          <div>

            <h1>
              User Attendance
            </h1>

            <p>
              Scan your NFC card and capture your face
              to mark attendance.
            </p>

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {attendanceSuccess && (
          <div
            className={
              attendanceType === "entry"
                ? "attendance-success entry-success"
                : "attendance-success exit-success"
            }
          >

            <div className="success-icon">
              <FiCheckCircle />
            </div>

            <div className="success-content">

              <h3>
                {attendanceType === "entry"
                  ? `Welcome ${userName}!`
                  : `Thank you ${userName}!`}
              </h3>

              <p>
                {attendanceType === "entry"
                  ? "Your entry has been successfully recorded."
                  : "Your exit has been successfully recorded."}
              </p>

            </div>

            <div className="success-time">

              <FiClock />

              {successTime}

            </div>

            <div
              className={
                attendanceType === "entry"
                  ? "status-badge entry-badge"
                  : "status-badge exit-badge"
              }
            >
              {attendanceType === "entry"
                ? "ENTRY"
                : "EXIT"}
            </div>

          </div>
        )}

        {/* =================================================
            ATTENDANCE GRID
        ================================================= */}

        <div className="attendance-grid">

          {/* =================================================
              NFC CARD
          ================================================= */}

          <section className="attendance-card">

            {/* CARD HEADING */}

            <div className="card-heading">

              <div className="heading-icon">
                <FiCast />
              </div>

              <h2>
                NFC ID
              </h2>

            </div>

            {/* DESCRIPTION */}

            <p className="card-description">
              Enter or scan your NFC card ID.
            </p>

            {/* NFC INPUT */}

            <div className="nfc-input-wrapper">

              <input
                type="text"
                className="nfc-input-field"
                value={nfcId}
                onChange={(event) => {
                  setNfcId(event.target.value);
                  setNfcStatus(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleNfcSubmit();
                  }
                }}
                placeholder="Enter or scan NFC ID"
                disabled={loading}
              />

              <button
                type="button"
                className="nfc-submit-button"
                onClick={handleNfcSubmit}
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

            {/* NFC SUCCESS */}

            {nfcStatus && (
              <div className="nfc-success">

                <FiCheckCircle />

                NFC Card Detected Successfully

              </div>
            )}

            {/* NFC ILLUSTRATION */}

            <div className="nfc-illustration">

              <span>
                <FiRadio />
              </span>

            </div>

            {/* HOW TO USE */}

            <div className="how-to-use">

              <FiInfo />

              <div>

                <h4>
                  How to use
                </h4>

                <p>
                  Enter your NFC ID manually or scan
                  your NFC card using the connected NFC
                  reader.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              FACE CAPTURE CARD
          ================================================= */}

          <section className="attendance-card">

            {/* CARD HEADING */}

            <div className="card-heading">

              <div className="heading-icon">
                <FiCamera />
              </div>

              <h2>
                Face Capture
              </h2>

            </div>

            {/* DESCRIPTION */}

            <p className="card-description">
              Position your face inside the frame.
            </p>

            {/* CAMERA */}

            <div className="camera-container">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />

              {/* FACE FRAME */}

              <div className="face-frame">

                <div className="corner top-left"></div>

                <div className="corner top-right"></div>

                <div className="corner bottom-left"></div>

                <div className="corner bottom-right"></div>

              </div>

              {/* FACE STATUS */}

              {faceDetected && (
                <div className="face-detected">

                  <FiCheckCircle />

                  Face Captured

                </div>
              )}

            </div>

          </section>

        </div>

        {/* =================================================
            SECURITY NOTICE
        ================================================= */}

        <div className="security-notice">

          <div className="security-icon">
            <FiShield />
          </div>

          <div>

            <h3>
              Security Notice
            </h3>

            <p>
              Your attendance is recorded securely.
              Please ensure your face is clearly visible
              during face capture.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default PublicDashboard;