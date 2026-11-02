import "./Sidebar.css";

import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="logo">

        <div className="logo-icon">
          <img src="\src\assets\logo.svg" alt="Logo" />
        </div>

        <div>
          <h3>
            Tap<span>2</span>Enter
          </h3>

          <p>Smart Entry System</p>
        </div>

      </div>

      {/* Menu */}

      <nav className="menu">

        <a href="#" className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}>
          <FaHome />
          Dashboard
        </a>

      
     
      <a href="#" className={currentPage === "userManagement" ? "active" : ""}
        onClick={() => setCurrentPage("userManagement")}>
        <FaUsers /> User Management
        </a>
      


{/*         <a href="#" className={currentPage === "entryExitLogs" ? "active" : ""}
          onClick={() => setCurrentPage("entryExitLogs")}>
          <FaClipboardList />
          Entry & Exit Logs
        </a>
 */}
        <a
  href="#"
  className={currentPage === "reports" ? "active" : ""}
  onClick={() => setCurrentPage("reports")}
>
  <FaChartBar />
  Reports
</a>

        <a href="#" className={currentPage === "settings" ? "active" : ""}
          onClick={() => setCurrentPage("settings")}>
          <FaCog />
          Settings
        </a>

      </nav>

      {/* Logout */}
{/* 
      <div className="logout">

        <a href="#" onClick={() => setCurrentPage("logout")}>
          <FaSignOutAlt />
          Logout
        </a>

      </div> */}

    </aside>
  );
};

export default Sidebar;