import "./ReportHeader.css";
import { FaChartBar } from "react-icons/fa";

function ReportHeader() {
  return (
    <div className="reportsHeader">

      <div className="headerLeft">

        <div className="reportIcon">
          <FaChartBar />
        </div>

        <div>
          <h2>Reports</h2>
          <p>Generate and download attendance and visitor reports</p>
        </div>

      </div>

      <div className="breadcrumb">
        Dashboard &gt; Reports
      </div>

    </div>
  );
}

export default ReportHeader;