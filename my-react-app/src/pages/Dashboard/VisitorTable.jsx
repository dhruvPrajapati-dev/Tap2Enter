import { useEffect, useState } from "react";
import axios from "axios";

import "./VisitorTable.css";

import VisitorModal from "./VisitorModal";

import FilterBar from "./FilterBar";

import { FiEye } from "react-icons/fi";


function VisitorTable() {

    // =====================================================
    // VISITOR DATA
    // =====================================================

    const [visitorData, setVisitorData] = useState([]);

    const [filteredVisitors, setFilteredVisitors] = useState([]);


    // =====================================================
    // SELECTED VISITOR
    // =====================================================

    const [selectedVisitor, setSelectedVisitor] = useState(null);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH VISITORS
    // =====================================================

    const fetchVisitors = async () => {

        try {

            setLoading(true);

            setError("");


            // -----------------------------------------
            // JWT TOKEN
            // -----------------------------------------

            const token =
                sessionStorage.getItem("token");


            // -----------------------------------------
            // SYSTEM ID
            // -----------------------------------------

            const systemID =
                sessionStorage.getItem("systemID");


            console.log(
                "System ID:",
                systemID
            );


            // -----------------------------------------
            // VALIDATE SYSTEM ID
            // -----------------------------------------

            if (!systemID) {

                setError(
                    "System ID not found."
                );

                return;

            }


            // -----------------------------------------
            // API CALL
            // -----------------------------------------

            const response = await axios.get(

                "http://127.0.0.1:5000/public/visitor/",

                {
                    params: {
                        sysID: systemID
                    },

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Visitor API Response:",
                response.data
            );


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            if (response.data?.success) {

                const data =
                    response.data.data || [];


                setVisitorData(data);

                setFilteredVisitors(data);

            }

            else {

                setError(
                    response.data?.message ||
                    "Visitor data not found."
                );

            }

        }

        catch (error) {

            console.error(
                "Visitor API Error:",
                error
            );


            if (error.response) {

                console.error(
                    "Backend Response:",
                    error.response.data
                );


                setError(
                    error.response.data?.message ||
                    "Unable to load visitor data."
                );

            }

            else if (error.request) {

                setError(
                    "Unable to connect to Flask Server."
                );

            }

            else {

                setError(
                    "Something went wrong."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        fetchVisitors();

    }, []);


    // =====================================================
    // FILTER FUNCTION
    // =====================================================

    const handleFilter = (filters) => {

        console.log(
            "Applied Filters:",
            filters
        );


        let result = [...visitorData];


        // =================================================
        // SEARCH
        // =================================================

        if (filters.search) {

            const search =
                filters.search.toLowerCase();


            result = result.filter((visitor) => {

                const name =
                    String(
                        visitor.visitorName || ""
                    ).toLowerCase();


                const mobile =
                    String(
                        visitor.contactNo || ""
                    ).toLowerCase();


                const visitorID =
                    String(
                        visitor.visitorID || ""
                    ).toLowerCase();


                return (

                    name.includes(search) ||

                    mobile.includes(search) ||

                    visitorID.includes(search)

                );

            });

        }


        // =================================================
        // DATE
        // =================================================

        if (filters.date) {

            result = result.filter((visitor) => {

                if (!visitor.createdDate) {
                    return false;
                }


                const visitorDate =
                    new Date(
                        visitor.createdDate
                    );


                if (
                    isNaN(
                        visitorDate.getTime()
                    )
                ) {

                    return false;

                }


                // YYYY-MM-DD
                const year =
                    visitorDate.getFullYear();


                const month =
                    String(
                        visitorDate.getMonth() + 1
                    ).padStart(2, "0");


                const day =
                    String(
                        visitorDate.getDate()
                    ).padStart(2, "0");


                const formattedDate =
                    `${year}-${month}-${day}`;


                return (
                    formattedDate === filters.date
                );

            });

        }


        // =================================================
        // STATUS
        // =================================================

        if (
            filters.status &&
            filters.status !== "All"
        ) {

            result = result.filter((visitor) => {

                const visitorStatus =
                    String(
                        visitor.status || ""
                    ).toLowerCase();


                return (
                    visitorStatus ===
                    filters.status.toLowerCase()
                );

            });

        }


        // =================================================
        // SET FILTERED DATA
        // =================================================

        setFilteredVisitors(result);

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="tableCard">

                <p>
                    Loading visitor data...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="tableCard">

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <>

            {/* =========================================
                FILTER BAR
            ========================================== */}

            <FilterBar
                onFilter={handleFilter}
            />


            {/* =========================================
                TABLE
            ========================================== */}

            <div className="tableCard">

                <table>

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Mobile
                            </th>

                            <th>
                                Purpose
                            </th>
{/* 
                            <th>
                                Face Captured
                            </th>
 */}
                            <th>
                                Created Date
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredVisitors.length > 0 ? (

                            filteredVisitors.map(
                                (visitor) => (

                                    <tr
                                        key={
                                            visitor.visitorID
                                        }
                                    >

                                        {/* ID */}

                                        <td>
                                            {
                                                visitor.visitorID
                                            }
                                        </td>


                                        {/* NAME */}

                                        <td>
                                            {
                                                visitor.visitorName
                                            }
                                        </td>


                                        {/* MOBILE */}

                                        <td>
                                            {
                                                visitor.contactNo
                                            }
                                        </td>


                                        {/* PURPOSE */}

                                        <td>
                                            {
                                                visitor.purpose ||
                                                "-"
                                            }
                                        </td>


                                        {/* FACE */}

                                  {/*       <td>

                                            {
                                                visitor.faceCaptured
                                                    ? "Yes"
                                                    : "No"
                                            }

                                        </td> */}


                                        {/* DATE */}

                                        <td>

                                            {
                                                visitor.createdDate
                                                    ? new Date(
                                                        visitor.createdDate
                                                    ).toLocaleString()
                                                    : "-"
                                            }

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                className="viewBtn"

                                                onClick={() =>
                                                    setSelectedVisitor(
                                                        visitor
                                                    )
                                                }
                                            >

                                                <FiEye />

                                            </button>

                                        </td>

                                    </tr>

                                )

                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign:
                                            "center"
                                    }}
                                >

                                    No visitors found.

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* =========================================
                VISITOR MODAL
            ========================================== */}

            {selectedVisitor && (

                <VisitorModal

                    visitor={
                        selectedVisitor
                    }

                    onClose={() =>
                        setSelectedVisitor(null)
                    }

                />

            )}

        </>

    );

}


export default VisitorTable;