import { ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import { AuthContext } from '@/contexts/AuthContext';
import { ErrorState } from '@/types/error';

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    if (!auth) {
        const errorState: ErrorState = {
            title: "Authentication Error",
            message: "Authentication context is not available.",
            showHome: true,
            showRetry: true
        };
        return <Navigate to="/error" state={errorState} replace />;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!auth.user.role || !allowedRoles.includes(auth.user.role)) {
        const errorState: ErrorState = {
            title: "Unauthorized Access",
            message: `You don't have permission to access this page. Your role (${auth.user.role}) does not have access to this resource.`,
            showHome: true,
            showRetry: false
        };
        return <Navigate to="/error" state={errorState} replace />;
    }

    return <>{children}</>;
};