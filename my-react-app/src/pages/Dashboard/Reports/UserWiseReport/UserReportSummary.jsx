import "./UserReportSummary.css";

import {
  FaSignInAlt,
  FaCheckCircle,
  FaClock,
  FaWifi,
  FaCamera
} from "react-icons/fa";

function UserReportSummary({ summary }) {

  const data = summary || {};

  const summaryCards = [

    {
      title: "Total Entries",
      value: data.totalEntries || 0,
      icon: <FaSignInAlt />,
      color: "entry"
    },

    {
      title: "Total Exit",
      value: data.totalExit || 0,
      icon: <FaSignInAlt />,
      color: "entry"
    },

    {
      title: "Present Days",
      value: data.presentDays || 0,
      icon: <FaCheckCircle />,
      color: "present"
    },

    {
      title: "Working Hours",
      value: data.workingHours || "0 Hrs",
      icon: <FaClock />,
      color: "working"
    },

    {
      title: "NFC Entries",
      value: data.nfcEntries || 0,
      icon: <FaWifi />,
      color: "nfc"
    },

    {
      title: "Face Entries",
      value: data.faceEntries || 0,
      icon: <FaCamera />,
      color: "face"
    }

  ];


  return (

    <div className="attendance-summary-wrapper">

      <div className="attendance-summary-header">

        <h2>
          Attendance Summary
        </h2>

        <p>
          Summary for the selected date range
        </p>

      </div>


      <div className="attendance-summary-grid">

        {summaryCards.map((card, index) => (

          <div
            key={index}
            className={`attendance-summary-card ${card.color}`}
          >

            <div className="attendance-summary-icon">
              {card.icon}
            </div>

            <h3>
              {card.value}
            </h3>

            <span>
              {card.title}
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}

export default UserReportSummary;