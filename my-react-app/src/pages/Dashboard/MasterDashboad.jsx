import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Reports from "./Reports/Reports";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement/UserManagement";
import Settings from "./Settings/Settings";
import EntryExitLogs from "./EntryExitLogs/EntryExitLogs";

function MasterDashboad() {

  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="MasterDashboad">

      <Navbar />

      <div style={{ display: "flex" }}>

        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

       <div
          style={{
            flex: 1,
            paddingLeft: "273px",
            background: "#F5F7FB",
            minHeight: "100vh",
          }}
        >

          {currentPage === "dashboard" && <Dashboard />}
  <div className="pageContent">

         {currentPage === "userManagement" && <UserManagement />}
           {currentPage === "entryExitLogs" && <EntryExitLogs/>} 
        {currentPage === "reports" && <Reports />}
          {currentPage === "settings" && <Settings />} 
        </div>

     

        </div>
 
      </div>
      
    {/* <Settings/> */}
   </div>
  );
}

export default MasterDashboad;