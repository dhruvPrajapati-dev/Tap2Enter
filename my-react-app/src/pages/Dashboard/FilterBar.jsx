import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./FilterBar.css";

import {
  FiSearch,
  FiCalendar,
  FiDownload,
} from "react-icons/fi";


function FilterBar({ onFilter }) {

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("All");


  // ==========================================
  // APPLY FILTER
  // ==========================================

  const handleSearch = () => {

    onFilter({
      search: search.trim(),
      date: date,
      status: status,
    });

  };


  // ==========================================
  // ENTER KEY SEARCH
  // ==========================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSearch();
    }

  };


  // ==========================================
  // RESET FILTER
  // ==========================================

  const handleReset = () => {

    setSearch("");
    setDate("");
    setStatus("All");

    onFilter({
      search: "",
      date: "",
      status: "All",
    });

  };


  return (

    <div className="filterBar">

      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="searchBox">

        <FiSearch className="searchIcon" />

        <input
          type="text"
          placeholder="Search by Name or Mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

      </div>


      {/* =====================================
          DATE
      ====================================== */}

      <div className="dateBox">

        <FiCalendar className="icon" />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

      </div>


      {/* =====================================
          STATUS
      ====================================== */}

   
      {/* =====================================
          SEARCH BUTTON
      ====================================== */}

      <button
        className="searchBtn"
        onClick={handleSearch}
        type="button"
      >
        Search
        <FaSearch />

      </button>


      {/* =====================================
          RESET BUTTON
      ====================================== */}

      <button
        className="resetBtn"
        onClick={handleReset}
        type="button"
      >

        Reset

      </button>


      {/* =====================================
          EXPORT
      ====================================== */}

      <button
        className="exportBtn"
        type="button"
      >

        <FiDownload />

        Export Report

      </button>

    </div>

  );

}


export default FilterBar;