import { ProtectedRoute } from "../ProtectedRoute";
import { MainLayout } from "./MainLayout";

export
    const ProtectedLayout: React.FC = () => {
        return (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        );
    };