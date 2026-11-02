import "./ReportFilter.css";

import {
    FaCalendarAlt,
    FaSyncAlt,
    FaFileAlt
} from "react-icons/fa";


function ReportFilter({

    fromDate,
    toDate,

    setFromDate,
    setToDate,

    onGenerate,
    onReset,

    loading

}) {

    return (

        <div className="filterRow">


            {/* =========================================
                FROM DATE
            ========================================= */}

            <div className="filterItem">

                <label>
                    From Date
                </label>

                <div className="dateInput">

                 

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(e.target.value)
                        }
                    />

                </div>

            </div>


            {/* =========================================
                TO DATE
            ========================================= */}

            <div className="filterItem">

                <label>
                    To Date
                </label>

                <div className="dateInput">

                 

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                            setToDate(e.target.value)
                        }
                    />

                </div>

            </div>


            {/* =========================================
                BUTTONS
            ========================================= */}

            <div className="filterButtons">


                {/* Generate */}

                <button
                    className="generateBtn"
                    onClick={onGenerate}
                    disabled={loading}
                >

                    <FaFileAlt />

                    {loading
                        ? "Generating..."
                        : "Generate Report"
                    }

                </button>


                {/* Reset */}

                <button
                    className="resetBtn"
                    onClick={onReset}
                    disabled={loading}
                >

                    <FaSyncAlt />

                    Reset

                </button>


            </div>

        </div>
    );
}


export default ReportFilter;