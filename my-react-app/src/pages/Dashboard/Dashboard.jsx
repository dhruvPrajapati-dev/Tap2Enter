import DashboardCards from "./DashboardCards";
import FilterBar from "./FilterBar";
import VisitorTable from "./VisitorTable"; 


function Dashboard() {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
        <p>Live Entry/Exit Monitor</p>
      </div>

      <DashboardCards />

      <VisitorTable /> 
    </div>
  );
}

export default Dashboard;