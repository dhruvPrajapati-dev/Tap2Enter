import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, allowedRole }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = sessionStorage.getItem("token");
            const role = sessionStorage.getItem("role");

            if (!token || role !== allowedRole) {
                setAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                await axios.get(
                    "http://127.0.0.1:5000/user/verify-token",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAuthorized(true);
            } catch {
                sessionStorage.clear();
                setAuthorized(false);
            }

            setLoading(false);
        };

        checkToken();
    }, [allowedRole]);

    if (loading) return <p>Loading...</p>;

    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return children;
}