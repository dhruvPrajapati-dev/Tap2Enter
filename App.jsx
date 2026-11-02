import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  CalendarDays,
  Radio,
  Camera,
  Check,
  Clock3,
  ShieldCheck,
  X,
  ScanFace,
} from "lucide-react";

import "./App.css";

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const ndefReaderRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [userType, setUserType] = useState("visitor");

  const [status, setStatus] = useState("granted");

  const [message, setMessage] = useState(
    "Tap your card and look into the camera"
  );

  const [cameraActive, setCameraActive] = useState(false);

  const [faceScanning, setFaceScanning] = useState(false);

  const [nfcScanning, setNfcScanning] = useState(false);

  const [lastMethod, setLastMethod] = useState(null);

  /* -------------------------------
     LIVE CLOCK
  -------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* -------------------------------
     CLEAN CAMERA ON EXIT
  -------------------------------- */

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* -------------------------------
     FORMAT DATE
  -------------------------------- */

  const dateText = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const timeText = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const shortTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* -------------------------------
     VISITOR BUTTON
  -------------------------------- */

  const handleVisitor = () => {
    setUserType((previous) =>
      previous === "visitor" ? "user" : "visitor"
    );

    setStatus("idle");
    setMessage("Ready for authentication");
  };

  /* -------------------------------
     NFC
  -------------------------------- */

  const startNfc = async () => {
    setLastMethod("nfc");
    setNfcScanning(true);
    setStatus("scanning");
    setMessage("Waiting for NFC card...");

    // Web NFC is mainly supported on Android Chrome.
    if (!("NDEFReader" in window)) {
      setTimeout(() => {
        setNfcScanning(false);
        setStatus("error");
        setMessage(
          "NFC is not supported in this browser. Use Android Chrome with NFC enabled."
        );
      }, 1000);

      return;
    }

    try {
      const ndef = new window.NDEFReader();

      ndefReaderRef.current = ndef;

      await ndef.scan();

      ndef.onreading = (event) => {
        console.log("NFC serial number:", event.serialNumber);

        setNfcScanning(false);
        setStatus("granted");
        setMessage("NFC card verified successfully");
      };

      ndef.onreadingerror = () => {
        setNfcScanning(false);
        setStatus("error");
        setMessage("Could not read the NFC card. Please try again.");
      };
    } catch (error) {
      console.error(error);

      setNfcScanning(false);
      setStatus("error");

      if (error.name === "NotAllowedError") {
        setMessage("NFC permission was denied.");
      } else {
        setMessage("Unable to start NFC scanning.");
      }
    }
  };

  /* -------------------------------
     CAMERA
  -------------------------------- */

  const startCamera = async () => {
    try {
      setLastMethod("face");

      setStatus("scanning");
      setFaceScanning(true);
      setMessage("Starting camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 640,
          },
          height: {
            ideal: 480,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      setCameraActive(true);
      setMessage("Look into the camera");

    } catch (error) {
      console.error(error);

      setCameraActive(false);
      setFaceScanning(false);
      setStatus("error");

      if (error.name === "NotAllowedError") {
        setMessage(
          "Camera permission was denied. Please allow camera access."
        );
      } else {
        setMessage("Unable to access the camera.");
      }
    }
  };

  /* -------------------------------
     STOP CAMERA
  -------------------------------- */

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

    setCameraActive(false);
    setFaceScanning(false);
  };

  /* -------------------------------
     SIMULATED FACE AUTH
  -------------------------------- */

  const authenticateFace = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }

    setMessage("Scanning face...");

    setStatus("scanning");

    setTimeout(() => {
      setStatus("granted");
      setFaceScanning(false);
      setMessage("Face verified successfully");

      stopCamera();
    }, 1800);
  };

  /* -------------------------------
     RESET
  -------------------------------- */

  const resetAuthentication = () => {
    stopCamera();

    setStatus("idle");

    setLastMethod(null);

    setMessage(
      "Tap your card and look into the camera"
    );
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="brand">

          <div className="brand-title">
            <span>Tap2</span>Enter
          </div>

          <div className="brand-subtitle">
            Secure Entry. Smarter Tomorrow.
          </div>

        </div>

        <div className="header-right">

          <button
            className={`visitor-button ${
              userType === "user" ? "user-active" : ""
            }`}
            onClick={handleVisitor}
          >
            <UserRound size={14} />

            {userType === "visitor"
              ? "I'm a Visitor"
              : "I'm a User"}
          </button>

          <div className="header-date">

            <div>
              <CalendarDays size={13} />

              <span>{dateText}</span>
            </div>

            <strong>{timeText}</strong>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="main">

        <section className="main-card">

          {/* TITLE */}

          <div className="page-title">

            <h1>NFC + Face Authentication</h1>

            <p>{message}</p>

          </div>


          <div className="content-grid">

            {/* ================= LEFT ================= */}

            <div className="left-panel">

              {/* NFC */}

              <button
                className={`nfc-card ${
                  lastMethod === "nfc" ? "selected" : ""
                }`}
                onClick={startNfc}
                disabled={nfcScanning}
              >

                <div className="nfc-icon">

                  {nfcScanning ? (
                    <div className="spinner" />
                  ) : (
                    <Radio size={25} />
                  )}

                </div>

                <div className="nfc-text">

                  <h3>NFC Card ID</h3>

                  <p>
                    {nfcScanning
                      ? "Waiting for card..."
                      : "Tap your card on the reader"}
                  </p>

                </div>

              </button>


              {/* OR */}

              <div className="or">

                <span>OR</span>

              </div>


              {/* FACE */}

              <div
                className={`face-card ${
                  lastMethod === "face" ? "selected" : ""
                }`}
              >

                <div className="face-camera">

                  {/* CAMERA */}

                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      className="camera-video"
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <div className="fake-avatar">

                      <div className="avatar-head" />

                      <div className="avatar-body" />

                    </div>
                  )}


                  {/* CAMERA CORNERS */}

                  <span className="corner corner-tl" />
                  <span className="corner corner-tr" />
                  <span className="corner corner-bl" />
                  <span className="corner corner-br" />

                </div>


                <button
                  className="scan-face-button"
                  onClick={authenticateFace}
                >

                  {cameraActive ? (
                    <>
                      <ScanFace size={16} />
                      {faceScanning
                        ? "Scanning..."
                        : "Verify Face"}
                    </>
                  ) : (
                    <>
                      <Camera size={16} />
                      Scan Face
                    </>
                  )}

                </button>

              </div>


              {/* STOP CAMERA */}

              {cameraActive && (
                <button
                  className="stop-camera"
                  onClick={() => {
                    stopCamera();
                    setStatus("idle");
                    setMessage(
                      "Tap your card and look into the camera"
                    );
                  }}
                >
                  <X size={13} />
                  Stop Camera
                </button>
              )}

            </div>


            {/* ================= RIGHT ================= */}

            <div
              className={`access-card ${status}`}
            >

              <div className="access-icon">

                {status === "granted" && (
                  <Check
                    size={48}
                    strokeWidth={3}
                  />
                )}

                {status === "error" && (
                  <X
                    size={48}
                    strokeWidth={3}
                  />
                )}

                {status === "scanning" && (
                  <div className="big-spinner" />
                )}

                {status === "idle" && (
                  <ShieldCheck
                    size={46}
                    strokeWidth={2}
                  />
                )}

              </div>


              <h2>

                {status === "granted" &&
                  "Access Granted"}

                {status === "error" &&
                  "Authentication Failed"}

                {status === "scanning" &&
                  "Scanning..."}

                {status === "idle" &&
                  "Ready"}

              </h2>


              <p className="welcome">

                {status === "granted" &&
                  "Welcome!"}

                {status === "error" &&
                  "Please try again"}

                {status === "scanning" &&
                  "Please wait"}

                {status === "idle" &&
                  "Waiting for authentication"}

              </p>


              {/* USER INFO */}

              <div className="user-info">

                <div className="info-row">

                  <div className="info-label">

                    <UserRound size={14} />

                    <span>User</span>

                  </div>

                  <span className="masked">
                    ••••••••
                  </span>

                </div>


                <div className="info-line" />


                <div className="info-row">

                  <div className="info-label">

                    <Clock3 size={14} />

                    <span>Time</span>

                  </div>

                  <span>
                    {shortTime}
                  </span>

                </div>

              </div>


              {/* RESET */}

              {(status === "error" ||
                status === "granted") && (
                <button
                  className="reset-button"
                  onClick={resetAuthentication}
                >
                  Authenticate Again
                </button>
              )}

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <ShieldCheck size={13} />

        <span>
          Tap2Enter © 2024 All rights reserved
        </span>

      </footer>

    </div>
  );
}

export default App;