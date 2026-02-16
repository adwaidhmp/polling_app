import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({ children, adminOnly = false }) => {
    const { user, access } = useSelector((state) => state.user);
    const location = useLocation();

    if (!access) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !user?.is_staff) {
        return <Navigate to="/polls" replace />;
    }

    return children;
};

export default RequireAuth;
