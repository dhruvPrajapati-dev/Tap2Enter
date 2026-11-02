import Header from "./Header";
import Stats from "./Stats";
import Filters from "./Filters";
import LogsTable from "./LogsTable";

import "./EntryExitLogs.css";
import { useState } from "react";

function EntryExitLogs() {
     // State
    const [openEntryExitLogs, setOpenEntryExitLogs] = useState(false);
  
    // Open User-wise Report Page
    if (openEntryExitLogs) {
      return (
        <EntryExitLogs
          onClose={() => setOpenEntryExitLogs(false)}
        />
      );
    }
    
  return (
    <div className="logs-page">

      <Header />

      <Stats />

      <div className="logs-card">
        <Filters />

        <LogsTable />

      
      </div>

    </div>
  );
}

export default EntryExitLogs;