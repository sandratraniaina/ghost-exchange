import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { LoginPage } from '@/components/pages/auth/LoginPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>

        </Routes>
    );
};