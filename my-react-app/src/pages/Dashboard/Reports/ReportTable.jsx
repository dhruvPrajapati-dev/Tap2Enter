import "./ReportTable.css";

import {
    FaFileExcel,
    FaFilePdf
} from "react-icons/fa";


function ReportTable({
    reports = [],
    visitors = [],
    reportType,
    setReportType
}) {

    // =====================================================
    // EXPORT
    // =====================================================

    const handleExportExcel = () => {
        alert("Excel export API can be connected here.");
    };

    const handleExportPDF = () => {
        alert("PDF export API can be connected here.");
    };


    // =====================================================
    // CURRENT DATA
    // =====================================================

    const tableData =
        reportType === "users"
            ? reports
            : visitors;


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="reportTableCard">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="tableHeader">

                <div>

                    <h2>
                        Detailed Report
                    </h2>

                    <p>
                        {reportType === "users"
                            ? "User attendance records"
                            : "Visitor records"
                        }
                    </p>

                </div>


                {/* =====================================
                    EXPORT BUTTONS
                ===================================== */}

                <div className="exportButtons">

                    <button
                        className="excelBtn"
                        onClick={handleExportExcel}
                    >
                        <FaFileExcel />
                        Export Excel
                    </button>


                    <button
                        className="pdfBtn"
                        onClick={handleExportPDF}
                    >
                        <FaFilePdf />
                        Export PDF
                    </button>

                </div>

            </div>


            {/* =========================================
                RADIO BUTTONS
            ========================================= */}

            <div className="reportTypeSelector">

                <label className="radioOption">

                    <input
                        type="radio"
                        name="reportType"
                        value="users"
                        checked={reportType === "users"}
                        onChange={() =>
                            setReportType("users")
                        }
                    />

                    <span>
                        Users
                    </span>

                </label>


                <label className="radioOption">

                    <input
                        type="radio"
                        name="reportType"
                        value="visitors"
                        checked={reportType === "visitors"}
                        onChange={() =>
                            setReportType("visitors")
                        }
                    />

                    <span>
                        Visitors
                    </span>

                </label>

            </div>


            {/* =========================================
                TABLE
            ========================================= */}

            <div className="tableResponsive">

                {reportType === "users" ? (

                    <UserTable
                        reports={tableData}
                    />

                ) : (

                    <VisitorTable
                        visitors={tableData}
                    />

                )}

            </div>


            {/* =========================================
                PAGINATION
            ========================================= */}

            <div className="pagination">

                <p>

                    Showing{" "}

                    <b>
                        {tableData.length}
                    </b>{" "}

                    Records

                </p>

            </div>

        </div>
    );
}


// =====================================================
// USER TABLE
// =====================================================

function UserTable({ reports }) {

    return (

        <table>

            <thead>

                <tr>

                    <th aria-setsize="1px" style={{ width: '15px' }}>
                        #
                    </th>
                    <th>Name</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Method</th>
                    <th>Status</th>

                </tr>

            </thead>


            <tbody>

                {reports.length === 0 ? (

                    <tr>

                        <td
                            colSpan="7"
                            className="noRecords"
                        >
                            No user attendance records found.
                        </td>

                    </tr>

                ) : (

                    reports.map((report, index) => (

                        <tr
                            key={
                                report.id ||
                                index
                            }
                        >

                            <td>
                                {index + 1}
                            </td>

                            <td>
                                {report.name || "--"}
                                <p>{report.userId || "--"}</p>
                            </td>

                            <td>
                                {report.entry || "--"}
                            </td>

                            <td>
                                {report.exit || "--"}
                            </td>

                            <td>

                                <span
                                    className={
                                        report.method
                                            ?.toUpperCase() === "NFC"
                                            ? "methodNFC"
                                            : "methodFace"
                                    }
                                >
                                    {report.method || "--"}
                                </span>

                            </td>

                            <td>

                                <span
                                    className={
                                        report.status === "Completed"
                                            ? "statusComplete"
                                            : "statusInside"
                                    }
                                >
                                    {report.status || "--"}
                                </span>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>
    );
}


// =====================================================
// VISITOR TABLE
// =====================================================

function VisitorTable({ visitors }) {

    return (

        <table>

            <thead>

                <tr>

                    <th style={{ width: '15px' }}>#</th>
                    <th>Visitor Name</th>
                    <th>Mobile No</th>
                    <th>Purpose</th>
                    <th>Enrty Time</th>

                </tr>

            </thead>


            <tbody>

                {visitors.length === 0 ? (

                    <tr>

                        <td
                            colSpan="6"
                            className="noRecords"
                        >
                            No visitor records found.
                        </td>

                    </tr>

                ) : (

                    visitors.map((visitor, index) => (

                        <tr
                            key={
                                visitor.id ||
                                visitor.visitorID ||
                                index
                            }
                        >

                            <td>
                                {index + 1}
                            </td>

                            <td>
                                {
                                    visitor.visitorname ||
                                    "--"
                                }
                            </td>

                            <td>
                                {
                                    visitor.contactNo ||
                                    "--"
                                }
                            </td>

                            <td>
                                {
                                    visitor.purpose ||
                                    "--"
                                }
                            </td>


                            <td>
                                {
                                    visitor.createdDate ||
                                    "--"
                                }
                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>
    );
}


export default ReportTable;