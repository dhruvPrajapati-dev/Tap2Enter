import React, { useEffect, useState } from "react";
import axios from "axios";

import StatCard from "./StatCard";

import {
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000";

// =====================================================
// API FUNCTION
// =====================================================

export const getDashboardCards = async () => {
  const token = sessionStorage.getItem("token");
  const systemID = sessionStorage.getItem("systemID");

  const response = await axios.get(
    `${API_URL}/public/dashboard/cards`,
    {
      params: {
        sysID: systemID,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// STATS COMPONENT
// =====================================================

function Stats({ dashboardData }) {

  const {
    totalVisitors = 0,
    totalEntries = 0,
    totalExits = 0,
    currentlyInside = 0,
  } = dashboardData || {};


  return (
    <div className="stats">

      {/* TODAY'S ENTRIES */}
      <StatCard
        icon={<FaSignInAlt />}
        title="Today's Entries"
        number={totalEntries}
        text="Total Entries"
        color="green"
      />


      {/* TODAY'S EXITS */}
      <StatCard
        icon={<FaSignOutAlt />}
        title="Today's Exits"
        number={totalExits}
        text="Total Exits"
        color="red"
      />


      {/* CURRENT PEOPLE INSIDE */}
      <StatCard
        icon={<FaUsers />}
        title="Current People Inside"
        number={currentlyInside}
        text="Currently Inside"
        color="blue"
      />


      {/* TOTAL VISITORS TODAY */}
      <StatCard
        icon={<FaChartLine />}
        title="Total Visitors Today"
        number={totalVisitors}
        text="Total Activities"
        color="purple"
      />

    </div>
  );
}


// =====================================================
// REPORTS COMPONENT
// =====================================================

function Reports() {

  const [dashboardData, setDashboardData] = useState({
    totalVisitors: 0,
    totalEntries: 0,
    totalExits: 0,
    currentlyInside: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ===================================================
  // FETCH DASHBOARD DATA
  // ===================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const result = await getDashboardCards();

        console.log("Dashboard API Response:", result);


        if (result.success === false) {

          setError(
            result.message || "Unable to load dashboard data."
          );

          return;
        }


        setDashboardData({
          totalVisitors: result.totalVisitors || 0,
          totalEntries: result.totalEntries || 0,
          totalExits: result.totalExits || 0,
          currentlyInside: result.currentlyInside || 0,
        });

      } catch (error) {

        console.error(
          "Dashboard API Error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);

      }
    };


    loadData();

  }, []);


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <div className="stats-loading">
        Loading dashboard data...
      </div>
    );

  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (
      <div className="stats-error">
        {error}
      </div>
    );

  }


  // ===================================================
  // UI
  // ===================================================

  return (
    <Stats
      dashboardData={dashboardData}
    />
  );
}


export default Reports;