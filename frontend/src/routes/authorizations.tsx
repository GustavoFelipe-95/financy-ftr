import { Navigate, useLocation } from "react-router-dom";
import { useAuthenticated } from "@/contexts/authContext";

export function RedirectAuthenticatedRoute({ children } : {children: React.ReactNode}) {
    const {isAuthenticated} = useAuthenticated();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export function ProtectRoute({ children } : {children: React.ReactNode}) {
    const {isAuthenticated} = useAuthenticated();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
}
