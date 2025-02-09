import { ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import { AuthContext } from '@/contexts/AuthContext';

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
        throw new Error('RoleBasedRoute must be used within an AuthProvider');
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!auth.user.role || !allowedRoles.includes(auth.user.role)) {
        return <Navigate
            to="/error"
            state={{
                title: "Unauthorized Access",
                message: "You don't have permission to access this page.",
                showRetry: false
            }}
            replace
        />;
    }

    return <>{children}</>;
};
