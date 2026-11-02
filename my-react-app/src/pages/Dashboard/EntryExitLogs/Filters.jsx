import { useState } from "react";

function Filters({ onSearch }) {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [method, setMethod] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = () => {

    onSearch({
      startDate,
      endDate,
      type,
      method,
      search: search.trim()
    });

  };

  /* const handleClear = () => {

    setStartDate("");
    setEndDate("");
    setType("");
    setMethod("");
    setSearch("");

    onSearch({
      startDate: "",
      endDate: "",
      type: "",
      method: "",
      search: ""
    });

  };
 */
  return (
    <div className="filters">

      <div className="filter-row">

        {/* START DATE */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* END DATE */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Type</option>
          <option value="entry">Entry</option>
          <option value="exit">Exit</option>
        </select>

        {/* METHOD */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">All Method</option>
          <option value="NFC">NFC</option>
          <option value="Face">Face</option>
        </select>

        {/* SEARCH */}
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SEARCH BUTTON */}
        <button
          type="button"
          className="search-btn"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* CLEAR BUTTON * /}
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
        >
          Clear
        </button>*/}

      </div>

    </div>
  );
}

export default Filters;