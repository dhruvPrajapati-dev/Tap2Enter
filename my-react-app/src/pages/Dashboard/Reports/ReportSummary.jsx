import "./ReportSummary.css";

import {
    FaSignInAlt,
    FaSignOutAlt,
    FaUsers,
    FaUserFriends
} from "react-icons/fa";


function ReportSummary({ summary }) {


    // =====================================================
    // DEFAULT VALUES
    // =====================================================

    const totalEntries =
        summary?.totalEntries || 0;


    const totalExits =
        summary?.totalExits || 0;


    const currentlyInside =
        summary?.currentlyInside || 0;


    const totalVisitors =
        summary?.totalVisitors || 0;


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="summarySection">


            {/* =========================================
                TOTAL ENTRIES
            ========================================= */}

            <div className="summaryCard">

                <div className="summaryIcon entryIcon">

                    <FaSignInAlt />

                </div>


                <div className="summaryContent">

                    <h4>
                        Total Entries
                    </h4>

                    <h2>
                        {totalEntries}
                    </h2>

                    <span>
                        Selected Period
                    </span>

                </div>

            </div>


            {/* =========================================
                TOTAL EXITS
            ========================================= */}

            <div className="summaryCard">

                <div className="summaryIcon exitIcon">

                    <FaSignOutAlt />

                </div>


                <div className="summaryContent">

                    <h4>
                        Total Exits
                    </h4>

                    <h2>
                        {totalExits}
                    </h2>

                    <span>
                        Selected Period
                    </span>

                </div>

            </div>


            {/* =========================================
                CURRENTLY INSIDE
            ========================================= */}

            <div className="summaryCard">

                <div className="summaryIcon insideIcon">

                    <FaUsers />

                </div>


                <div className="summaryContent">

                    <h4>
                        Current Inside
                    </h4>

                    <h2>
                        {currentlyInside}
                    </h2>

                    <span>
                        Live Count
                    </span>

                </div>

            </div>


            {/* =========================================
                VISITORS
            ========================================= */}

            <div className="summaryCard">

                <div className="summaryIcon visitorIcon">

                    <FaUserFriends />

                </div>


                <div className="summaryContent">

                    <h4>
                        Visitors
                    </h4>

                    <h2>
                        {totalVisitors}
                    </h2>

                    <span>
                        Selected Period
                    </span>

                </div>

            </div>


        </div>
    );
}


export default ReportSummary;