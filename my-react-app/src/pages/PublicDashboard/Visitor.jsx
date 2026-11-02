import React, { useEffect, useRef, useState } from "react";
import {
    FiArrowLeft,
    FiUser,
    FiPhone,
    FiMail,
    FiFileText,
    FiCamera,
    FiCheckCircle,
    FiClock,
    FiShield,
} from "react-icons/fi";
import axios from "axios";
import "./Visitor.css";

// =====================================================
// FLASK BACKEND
// =====================================================

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// VISITOR COMPONENT
// =====================================================

const Visitor = ({ onBack }) => {

   
    // VISITOR FORM
   

    const [visitor, setVisitor] = useState({
        name: "",
        mobile: "",
        email: "",
        purpose: "",
    });

   
    // FACE
   

    const [faceCaptured, setFaceCaptured] = useState(false);
    const [cameraError, setCameraError] = useState(false);

   
    // API
   

    const [loading, setLoading] = useState(false);

   
    // CAMERA
   

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const captureTimerRef = useRef(null);

   
    // CLOCK
   

    const [currentTime, setCurrentTime] = useState(new Date());

   
    // REAL-TIME CLOCK
   

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

   
    // START CAMERA ON PAGE LOAD
   

    useEffect(() => {
        startCamera();

        return () => {
            if (captureTimerRef.current) {
                clearTimeout(captureTimerRef.current);
            }

            stopCamera();
        };
    }, []);

   
    // START CAMERA
   

    const startCamera = async () => {
        try {
            setCameraError(false);
            setFaceCaptured(false);

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                console.error(
                    "Camera API is not supported by this browser."
                );

                setCameraError(true);
                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                        facingMode: "user",
                    },
                    audio: false,
                });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.warn(
                        "Video autoplay warning:",
                        playError
                    );
                }
            }

            // =================================================
            // AUTOMATIC FACE CAPTURE
            // =================================================
            //
            // Currently marks face as captured after 3 seconds.
            // Replace this later with actual face detection API.
            //

            captureTimerRef.current = setTimeout(() => {
                setFaceCaptured(true);
            }, 3000);

        } catch (error) {
            console.error("Camera Error:", error);

            setCameraError(true);
            setFaceCaptured(false);
        }
    };

   
    // STOP CAMERA
   

    const stopCamera = () => {
        if (captureTimerRef.current) {
            clearTimeout(captureTimerRef.current);
            captureTimerRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

   
    // FORM CHANGE
   

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setVisitor((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

   
    // MOBILE CHANGE
   

    const handleMobileChange = (event) => {
        const value = event.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

        setVisitor((previous) => ({
            ...previous,
            mobile: value,
        }));
    };

   
    // MOBILE VALIDATION
   

    const validateMobile = (mobile) => {
        const mobileRegex = /^[0-9]{10}$/;

        return mobileRegex.test(mobile);
    };

   
    // EMAIL VALIDATION
   

    const validateEmail = (email) => {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };

   
    // SUBMIT VISITOR
   

    const handleSubmit = async (event) => {
        event.preventDefault();

        // =================================================
        // PREVENT DOUBLE SUBMIT
        // =================================================

        if (loading) {
            return;
        }

        // =================================================
        // NAME
        // =================================================

        if (!visitor.name.trim()) {
            alert("Please enter visitor name.");
            return;
        }

        // =================================================
        // MOBILE
        // =================================================

        if (!visitor.mobile.trim()) {
            alert("Please enter mobile number.");
            return;
        }

        if (!validateMobile(visitor.mobile.trim())) {
            alert(
                "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        // =================================================
        // EMAIL
        // =================================================

        if (visitor.email.trim()) {
            if (!validateEmail(visitor.email.trim())) {
                alert(
                    "Please enter a valid email address."
                );
                return;
            }
        }

        // =================================================
        // PURPOSE
        // =================================================

        if (!visitor.purpose.trim()) {
            alert("Please enter purpose of visit.");
            return;
        }

        // =================================================
        // FACE
        // =================================================

        if (!faceCaptured) {
            alert(
                "Please wait. Face is being captured automatically."
            );
            return;
        }

        try {
            // =================================================
            // START LOADING
            // =================================================

            setLoading(true);

            // =================================================
            // JWT TOKEN
            // =================================================

            const token =
                sessionStorage.getItem("token");
            const sysID =
                sessionStorage.getItem("systemID");
            // =================================================
            // VISITOR DATA
            // =================================================
            
            // ENTRY DATA ONLY.
            
            // No:
            // exitTime
            // checkOut
            // exitDate
            //
            // Flask creates entryTime.
            //

            const visitorData = {
                sysID: sysID,
                visitorName: visitor.name.trim(),
                mobile: visitor.mobile.trim(),
                email: visitor.email.trim(),
                purpose: visitor.purpose.trim(),
                faceCaptured: true,
            };

            console.log(
                "Sending Visitor Data:",
                visitorData
            );

            // =================================================
            // VISITOR API
            // =================================================

            const response = await axios.post(
                `${API_URL}/public/visitor`,
                visitorData,
                {
                    sysID: sysID,
                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token && {
                            Authorization:
                                `Bearer ${token}`,
                        }),
                    },

                    timeout: 10000,
                }
            );

            // =================================================
            // RESPONSE
            // =================================================

            console.log(
                "Visitor Response:",
                response.data
            );

            // =================================================
            // SUCCESS
            // =================================================

            if (response.data?.success) {

                const visitorName =
                    response.data.visitorName ||
                    visitor.name;

                const visitorID =
                    response.data.visitorID;

                const successMessage =
                    `Welcome ${visitorName}!\n\n` +
                    `Visitor entry successfully recorded.` +
                    (
                        visitorID
                            ? `\nVisitor ID: ${visitorID}`
                            : ""
                    );

                alert(successMessage);

                // =================================================
                // RESET FORM
                // =================================================

                setVisitor({
                    name: "",
                    mobile: "",
                    email: "",
                    purpose: "",
                });

                setFaceCaptured(false);

                // =================================================
                // STOP CAMERA
                // =================================================

                stopCamera();

                // =================================================
                // BACK TO USER PAGE
                // =================================================

                if (onBack) {
                    onBack();
                }

            } else {

                alert(
                    response.data?.message ||
                    "Visitor entry failed."
                );
            }

        } catch (error) {

            // =================================================
            // ERROR
            // =================================================

            console.error(
                "Visitor API Error:",
                error
            );

            // =================================================
            // BACKEND RESPONSE ERROR
            // =================================================

            if (error.response) {

                console.error(
                    "Backend Status:",
                    error.response.status
                );

                console.error(
                    "Backend Data:",
                    error.response.data
                );

                alert(
                    error.response.data?.message ||
                    "Visitor request failed."
                );

            }

            // =================================================
            // SERVER CONNECTION ERROR
            // =================================================

            else if (error.request) {

                alert(
                    "Unable to connect to Flask Server.\n\n" +
                    "Please make sure Flask is running on " +
                    "http://127.0.0.1:5000"
                );

            }

            // =================================================
            // OTHER ERROR
            // =================================================

            else {

                alert(
                    "Something went wrong."
                );
            }

        } finally {

            // =================================================
            // STOP LOADING
            // =================================================

            setLoading(false);
        }
    };

   
    // I'M USER
   

    const handleBackToUser = () => {

        if (loading) {
            return;
        }

        stopCamera();

        if (onBack) {
            onBack();
        }
    };

   
    // DATE
   

    const formattedDate =
        currentTime.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

   
    // TIME
   

    const formattedTime =
        currentTime.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }
        );

   
    // PAGE
   

    return (
        <div className="visitor-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="visitor-header">

                {/* BRAND */}

                <div className="visitor-brand">

                    <div className="logo-icon">
            <img
              src="/src/assets/logo.svg"
              alt="Tap2Enter Logo"
            />
          </div>
                    <div className="visitor-brand-text">

                        <h2>
                            Tap2Enter
                        </h2>

                        <span>
                            Smart Attendance System
                        </span>

                    </div>

                </div>

                {/* HEADER RIGHT */}

                <div className="visitor-header-right">

                    {/* DATE / TIME */}

                    <div className="visitor-time">

                        <FiClock />

                        <span>
                            {formattedDate}
                            {" | "}
                            {formattedTime}
                        </span>

                    </div>

                    {/* I'M USER */}

                    <button
                        type="button"
                        className="back-user-button"
                        onClick={handleBackToUser}
                        disabled={loading}
                    >
                        <FiArrowLeft />

                        I'm User

                    </button>

                </div>

            </header>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="visitor-main">

                {/* PAGE TITLE */}

                <div className="visitor-title">

                    <div className="visitor-title-line"></div>

                    <div>

                        <h1>
                            Visitor Registration
                        </h1>

                        <p>
                            Enter your details and look at
                            the camera. Your face will be
                            captured automatically.
                        </p>

                    </div>

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="visitor-content">

                    {/* =================================================
                        LEFT SIDE - FORM
                    ================================================= */}

                    <section className="visitor-form-card">

                        {/* CARD HEADER */}

                        <div className="visitor-card-title">

                            <div className="visitor-card-icon">
                                <FiUser />
                            </div>

                            <h2>
                                Visitor Information
                            </h2>

                        </div>

                        <p className="visitor-description">
                            Please enter the visitor's information.
                        </p>

                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            {/* NAME */}

                            <div className="visitor-input-group">

                                <label>
                                    Visitor Name
                                    <span>*</span>
                                </label>

                                <div className="visitor-input">

                                    <FiUser />

                                    <input
                                        type="text"
                                        name="name"
                                        value={visitor.name}
                                        onChange={handleChange}
                                        placeholder="Enter visitor name"
                                        autoComplete="off"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* MOBILE */}

                            <div className="visitor-input-group">

                                <label>
                                    Mobile Number
                                    <span>*</span>
                                </label>

                                <div className="visitor-input">

                                    <FiPhone />

                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={visitor.mobile}
                                        onChange={handleMobileChange}
                                        placeholder="Enter 10-digit mobile number"
                                        autoComplete="off"
                                        maxLength={10}
                                        inputMode="numeric"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* EMAIL */}

                            <div className="visitor-input-group">

                                <label>
                                    Email Address
                                </label>

                                <div className="visitor-input">

                                    <FiMail />

                                    <input
                                        type="email"
                                        name="email"
                                        value={visitor.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        autoComplete="off"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* PURPOSE */}

                            <div className="visitor-input-group">

                                <label>
                                    Purpose of Visit
                                    <span>*</span>
                                </label>

                                <div className="visitor-textarea">

                                    <FiFileText />

                                    <textarea
                                        name="purpose"
                                        value={visitor.purpose}
                                        onChange={handleChange}
                                        placeholder="Enter purpose of visit"
                                        rows={3}
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="visitor-submit"
                                disabled={
                                    loading ||
                                    !faceCaptured
                                }
                            >

                                {loading ? (
                                    <>
                                        Saving Visitor Entry...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle />

                                        Submit Visitor Entry
                                    </>
                                )}

                            </button>

                        </form>

                    </section>

                    {/* =================================================
                        RIGHT SIDE - FACE
                    ================================================= */}

                    <section className="visitor-face-card">

                        {/* CARD HEADER */}

                        <div className="visitor-card-title">

                            <div className="visitor-card-icon">
                                <FiCamera />
                            </div>

                            <h2>
                                Face Capture
                            </h2>

                        </div>

                        <p className="visitor-description">
                            Look directly at the camera.
                            Face capture starts automatically.
                        </p>

                        {/* CAMERA */}

                        <div className="visitor-camera">

                            {!cameraError ? (

                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="visitor-video"
                                />

                            ) : (

                                <div className="camera-error">

                                    <FiCamera />

                                    <h3>
                                        Camera unavailable
                                    </h3>

                                    <p>
                                        Please allow camera
                                        permission in your
                                        browser.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        disabled={loading}
                                    >
                                        Try Camera Again
                                    </button>

                                </div>

                            )}

                            {/* FACE FRAME */}

                            {!cameraError && (

                                <div className="visitor-face-frame">

                                    <div className="visitor-corner top-left"></div>

                                    <div className="visitor-corner top-right"></div>

                                    <div className="visitor-corner bottom-left"></div>

                                    <div className="visitor-corner bottom-right"></div>

                                </div>

                            )}

                            {/* SCANNING */}

                            {!cameraError &&
                                !faceCaptured && (

                                    <div className="face-scanning">

                                        <span className="scanning-dot"></span>

                                        Detecting face...

                                    </div>

                                )}

                            {/* CAPTURED */}

                            {faceCaptured && (

                                <div className="visitor-face-detected">

                                    <FiCheckCircle />

                                    Face Captured Automatically

                                </div>

                            )}

                        </div>

                        {/* FACE STATUS */}

                        <div
                            className={
                                faceCaptured
                                    ? "automatic-face-status captured"
                                    : "automatic-face-status"
                            }
                        >

                            {faceCaptured ? (

                                <>

                                    <FiCheckCircle />

                                    <span>
                                        Face captured successfully
                                    </span>

                                </>

                            ) : (

                                <>

                                    <span className="status-dot"></span>

                                    <span>
                                        Scanning for face...
                                    </span>

                                </>

                            )}

                        </div>

                        {/* SECURITY */}

                        <div className="visitor-security">

                            <div className="visitor-security-icon">

                                <FiShield />

                            </div>

                            <div>

                                <strong>
                                    Automatic Face Capture
                                </strong>

                                <p>
                                    No capture button is required.
                                    Keep your face inside the frame.
                                </p>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
};

export default Visitor;