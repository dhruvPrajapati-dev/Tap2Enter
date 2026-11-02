import "./ReportCards.css";

import {
    FaCalendarDay,
    FaCalendarWeek,
    FaCalendarAlt,
    FaUsers
} from "react-icons/fa";


function ReportCards({

    onDailyReport,
    onWeeklyReport,
    onMonthlyReport,
    onUserWiseReport

}) {

    return (

        <div className="reportCards">


            {/* =========================================
                DAILY
            ========================================= */}

            <div
                className="reportCard active"
                onClick={onDailyReport}
            >

                <div className="cardIcon daily">

                    <FaCalendarDay />

                </div>

                <h3>
                    Daily Report
                </h3>

                <p>
                    Generate today's attendance report
                </p>

            </div>


            {/* =========================================
                WEEKLY
            ========================================= */}

            <div
                className="reportCard"
                onClick={onWeeklyReport}
            >

                <div className="cardIcon weekly">

                    <FaCalendarWeek />

                </div>

                <h3>
                    Weekly Report
                </h3>

                <p>
                    Generate weekly attendance report
                </p>

            </div>


            {/* =========================================
                MONTHLY
            ========================================= */}

            <div
                className="reportCard"
                onClick={onMonthlyReport}
            >

                <div className="cardIcon monthly">

                    <FaCalendarAlt />

                </div>

                <h3>
                    Monthly Report
                </h3>

                <p>
                    Generate monthly attendance report
                </p>

            </div>


            {/* =========================================
                USER WISE
            ========================================= */}

            <div
                className="reportCard"
                onClick={onUserWiseReport}
            >

                <div className="cardIcon user">

                    <FaUsers />

                </div>

                <h3>
                    User-wise Report
                </h3>

                <p>
                    Generate individual user report
                </p>

            </div>


        </div>
    );
}


export default ReportCards;