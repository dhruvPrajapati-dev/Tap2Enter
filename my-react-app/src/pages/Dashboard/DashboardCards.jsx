import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardCards.css";

import {
    FaUsers,
    FaSignInAlt,
    FaSignOutAlt,
} from "react-icons/fa";

import { HiUserGroup } from "react-icons/hi";

// =====================================================
// FLASK API URL
// =====================================================

const API_URL = "http://127.0.0.1:5000";


// =====================================================
// DASHBOARD CARDS
// =====================================================

const DashboardCards = () => {

    // =================================================
    // DASHBOARD DATA
    // =================================================

    const [dashboardData, setDashboardData] = useState({
        totalVisitors: 0,
        totalEntries: 0,
        totalExits: 0,
        currentlyInside: 0,
    });

    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] = useState(true);


    // =================================================
    // GET DASHBOARD CARD DATA
    // =================================================

    const fetchDashboardCards = async () => {

        try {

            setLoading(true);

            // -----------------------------------------
            // JWT TOKEN
            // -----------------------------------------

            const token = sessionStorage.getItem("token");

            // -----------------------------------------
            // API CALL
            // -----------------------------------------


        const response = await axios.get(
        "http://127.0.0.1:5000/public/dashboard/cards",
        {
          params: {
            sysID: sessionStorage.getItem("systemID")
          }
        }
      );

    
            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            if (response.data?.success) {

                setDashboardData({
                    totalVisitors:
                        response.data.totalVisitors || 0,

                    totalEntries:
                        response.data.totalEntries || 0,

                    totalExits:
                        response.data.totalExits || 0,

                    currentlyInside:
                        response.data.currentlyInside || 0,
                });

            } else {

                console.error(
                    response.data?.message ||
                    "Dashboard data not found."
                );

            }

        } catch (error) {

            // -----------------------------------------
            // API ERROR
            // -----------------------------------------

            console.error(
                "Dashboard Cards API Error:",
                error
            );


            // -----------------------------------------
            // SERVER RESPONSE ERROR
            // -----------------------------------------

            if (error.response) {

                console.error(
                    "Backend Response:",
                    error.response.data
                );

            }

            // -----------------------------------------
            // SERVER CONNECTION ERROR
            // -----------------------------------------

            else if (error.request) {

                console.error(
                    "Unable to connect to Flask Server."
                );

            }

            // -----------------------------------------
            // OTHER ERROR
            // -----------------------------------------

            else {

                console.error(
                    "Something went wrong."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    // =================================================
    // LOAD API DATA
    // =================================================

    useEffect(() => {

        fetchDashboardCards();

        // ---------------------------------------------
        // AUTO REFRESH
        // ---------------------------------------------

        const interval = setInterval(() => {

            fetchDashboardCards();

        }, 1000000);


        // ---------------------------------------------
        // CLEANUP
        // ---------------------------------------------

        return () => {

            clearInterval(interval);

        };

    }, []);


    // =================================================
    // CARDS
    // =================================================

    const cards = [

        {
            title: "Today's Total Visitors",

            value:
                dashboardData.totalVisitors,

            color: "#2563eb",

            icon: <FaUsers />,
        },


        {
            title: "Today's Total Entries",

            value:
                dashboardData.totalEntries,

            color: "#22c55e",

            icon: <FaSignInAlt />,
        },


        {
            title: "Today's Total Exits",

            value:
                dashboardData.totalExits,

            color: "#fb3c3c",

            icon: <FaSignOutAlt />,
        },


        {
            title: "Currently People Inside",

            value:
                dashboardData.currentlyInside,

            color: "#6366f1",

            icon: <HiUserGroup />,
        },

    ];


    // =================================================
    // PAGE
    // =================================================

    return (

        <div className="dashboard-cards">

            {cards.map((card, index) => (

                <div
                    className="dashboard-card"
                    key={index}
                >

                    {/* CARD ICON */}

                    <div
                        className="card-icon"
                        style={{
                            backgroundColor:
                                card.color,
                        }}
                    >

                        {card.icon}

                    </div>


                    {/* CARD CONTENT */}

                    <div className="card-content">

                        <h4>
                            {card.title}
                        </h4>


                        <h2>

                            {loading
                                ? "..."
                                : card.value}

                        </h2>

                    </div>

                </div>

            ))}

        </div>

    );
};


export default DashboardCards;