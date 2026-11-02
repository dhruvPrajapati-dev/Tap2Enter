import { Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";

import Login from "./pages/Login/Login";
import MasterDashboard from "./pages/Dashboard/MasterDashboad";
import PublicDashboard from "./pages/PublicDashboard/PublicDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* Admin Login */}
            <Route
                path="/admin"
                element={<AdminLogin />}
            />

            {/* Admin Dashboard */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* User Login */}
            <Route
                path="/login"
                element={<Login />}
            />
              <Route
                path="/"
                element={<Login />}
            />


            {/* Master Dashboard */}
            <Route
                path="/master/dashboard"
                element={
                    <ProtectedRoute allowedRole="master">
                        <MasterDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Public Dashboard */}
            <Route
                path="/public/dashboard"
                element={
                    <ProtectedRoute allowedRole="public">
                        <PublicDashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;