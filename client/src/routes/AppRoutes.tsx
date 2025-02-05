import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Dashboard } from '@/components/pages/Dashboard/Dashboard';
import { LoginPage } from '@/components/pages/auth/LoginPage';
import { SignupPage } from '@/components/pages/auth/SignupPage';
import { Wallet } from '@/components/pages/Wallet/Wallet';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/wallet" element={<Wallet />} />
            </Route>

        </Routes>
    );
};