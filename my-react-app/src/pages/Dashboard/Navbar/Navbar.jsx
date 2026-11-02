import React, { useState, useEffect } from "react";
import "./Navbar.css";

import {
  FiCalendar,
  FiClock,
} from "react-icons/fi";

import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  // State for current date & time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = currentDateTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = currentDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const sysName = sessionStorage.getItem("systemName");
  return (
    <header className="navbar">

      {/* Left */}
      <div className="navbar-left">
    
      </div>

      {/* Right */}
      <div className="navbar-right">

        <div className="navbar-item">
          <FiCalendar />
          <span>{date}</span>
        </div>

        <div className="navbar-item">
          <FiClock />
          <span>{time}</span>
        </div>

        <div className="profile">
          <FaUserCircle className="profile-icon" />

          <div>
            <h4>{sysName}</h4>
            <p>
              <span className="online"></span>
              Online
            </p>
          </div>
        </div>

      </div>

    </header>
  );
};

export default Navbar;