import { useEffect, useState } from "react";
import axios from "axios";

import "./Reports.css";

import ReportHeader from "./ReportHeader";
import ReportCards from "./ReportCards";
import ReportFilter from "./ReportFilter";
import ReportSummary from "./ReportSummary";
import ReportTable from "./ReportTable";
import UserWiseReport from "./UserWiseReport/UserWiseReport";


function Reports() {

    // =====================================================
    // USER WISE REPORT
    // =====================================================

    const [openUserWiseReport, setOpenUserWiseReport] =
        useState(false);
        // const [reports, setReports] = useState([]);

const [visitors, setVisitors] = useState([]);

const [reportType, setReportType] = useState("users");


    // =====================================================
    // DATE
    // =====================================================

    const getToday = () => {

        const today = new Date();

        return today.toISOString().split("T")[0];
    };


    const [fromDate, setFromDate] = useState(getToday());
    const [toDate, setToDate] = useState(getToday());


    // =====================================================
    // DATA
    // =====================================================

    const [summary, setSummary] = useState({
        totalEntries: 0,
        totalExits: 0,
        currentlyInside: 0,
        totalVisitors: 0
    });


    const [reports, setReports] = useState([]);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // API URL
    // =====================================================

    const API_URL = "http://127.0.0.1:5000";


    // =====================================================
    // FETCH REPORT
    // =====================================================

   const fetchReport = async (
    selectedFromDate = fromDate,
    selectedToDate = toDate
) => {

    try {

        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Authentication token not found.");
            return;
        }


        const response = await axios.get(
            `${API_URL}/public/reports`,
            {
                params: {
                    fromDate: selectedFromDate,
                    toDate: selectedToDate
                },

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (response.data.success) {

            setSummary(
                response.data.summary || {
                    totalEntries: 0,
                    totalExits: 0,
                    currentlyInside: 0,
                    totalVisitors: 0
                }
            );


            // User data
            setReports(
                response.data.reports || []
            );


            // Visitor data
            setVisitors(
                response.data.visitors || []
            );

        } else {

            setError(
                response.data.message ||
                "Unable to generate report."
            );

        }

    } catch (err) {

        console.error(
            "REPORT API ERROR:",
            err
        );

        setError(
            err.response?.data?.message ||
            "Unable to connect to server."
        );

    } finally {

        setLoading(false);
    }
};

    // =====================================================
    // LOAD TODAY REPORT
    // =====================================================

    useEffect(() => {

        fetchReport();

    }, []);


    // =====================================================
    // GENERATE REPORT
    // =====================================================

    const handleGenerateReport = () => {

        if (!fromDate || !toDate) {

            setError(
                "Please select From Date and To Date."
            );

            return;
        }


        if (fromDate > toDate) {

            setError(
                "From Date cannot be greater than To Date."
            );

            return;
        }


        fetchReport(
            fromDate,
            toDate
        );
    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        const today = getToday();


        setFromDate(today);
        setToDate(today);

        setError("");


        fetchReport(
            today,
            today
        );
    };


    // =====================================================
    // DAILY REPORT
    // =====================================================

    const handleDailyReport = () => {

        const today = getToday();


        setFromDate(today);
        setToDate(today);


        fetchReport(
            today,
            today
        );
    };


    // =====================================================
    // WEEKLY REPORT
    // =====================================================

    const handleWeeklyReport = () => {

        const today = new Date();


        const day = today.getDay();


        // Monday = 0
        const difference =
            day === 0 ? 6 : day - 1;


        const monday = new Date(today);

        monday.setDate(
            today.getDate() - difference
        );


        const sunday = new Date(monday);

        sunday.setDate(
            monday.getDate() + 6
        );


        const formatDate = (date) => {

            return date
                .toISOString()
                .split("T")[0];
        };


        const start = formatDate(monday);
        const end = formatDate(sunday);


        setFromDate(start);
        setToDate(end);


        fetchReport(
            start,
            end
        );
    };


    // =====================================================
    // MONTHLY REPORT
    // =====================================================

    const handleMonthlyReport = () => {

        const today = new Date();


        const year = today.getFullYear();
        const month = today.getMonth();


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        const formatDate = (date) => {

            return date
                .toISOString()
                .split("T")[0];
        };


        const start =
            formatDate(firstDay);


        const end =
            formatDate(lastDay);


        setFromDate(start);
        setToDate(end);


        fetchReport(
            start,
            end
        );
    };


    // =====================================================
    // USER WISE PAGE
    // =====================================================

    if (openUserWiseReport) {

        return (
            <UserWiseReport
                onClose={() =>
                    setOpenUserWiseReport(false)
                }
            />
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="reportsPage">

            {/* Header */}

            <ReportHeader />


            {/* Report Cards */}

            <ReportCards
                onDailyReport={handleDailyReport}
                onWeeklyReport={handleWeeklyReport}
                onMonthlyReport={handleMonthlyReport}
                onUserWiseReport={() =>
                    setOpenUserWiseReport(true)
                }
            />


            {/* Filter */}

            <ReportFilter
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                onGenerate={handleGenerateReport}
                onReset={handleReset}
                loading={loading}
            />


            {/* Error */}

            {error && (

                <div className="reportError">
                    {error}
                </div>

            )}


            {/* Loading */}

            {loading && (

                <div className="reportLoading">
                    Loading report...
                </div>

            )}


            {/* Summary */}

            <ReportSummary
                summary={summary}
            />


            {/* Table */}

           <ReportTable
    reports={reports}
    visitors={visitors}
    reportType={reportType}
    setReportType={setReportType}
/>

        </div>
    );
}


export default Reports;