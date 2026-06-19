import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); 

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === "association") return <Navigate to="/dashboard-association" replace />;
        if (role === "benevole") return <Navigate to="/dashboard-benevole" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;