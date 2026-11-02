import "./UserFilter.css";
import {
  FaSearch,
  FaFilter,
  FaUndoAlt
} from "react-icons/fa";

function UserFilter({
  search,
  setSearch,
  status,
  setStatus,
  onSearch,
  onReset
}) {
  return (
    <div className="filterCard">

      {/* SEARCH */}
      <input
        type="text"
        className="searchBox"
        placeholder="Search by Name, Mobile, Email or User ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* STATUS */}
      <select
        className="selectBox"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {/* SEARCH BUTTON */}
      <button
        type="button"
        className="searchBtn"
        onClick={onSearch}
      >
        <FaSearch />
        Search
      </button>

      {/* FILTER BUTTON */}
      <button
        type="button"
        className="filterBtn"
        onClick={onSearch}
      >
        <FaFilter />
        Filter
      </button>

      {/* RESET BUTTON */}
      <button
        type="button"
        className="resetBtn"
        onClick={onReset}
      >
        <FaUndoAlt />
        Reset
      </button>

    </div>
  );
}

export default UserFilter;