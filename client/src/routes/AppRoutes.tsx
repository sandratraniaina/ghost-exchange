import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { LoginPage } from '@/components/pages/auth/LoginPage';
import { SignupPage } from '@/components/pages/auth/SignupPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>

        </Routes>
    );
};