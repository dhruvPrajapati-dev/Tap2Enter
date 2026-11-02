import { FaExchangeAlt } from "react-icons/fa";
function Header() {
  return (
    <div className="logs-header">

      <div className="header-icon">
        <FaExchangeAlt /> 
      </div>

      <div>
        <h1>Entry / Exit Logs</h1>
        <p>View all entry and exit activities</p>
      </div>

    </div>
  );
}

export default Header;