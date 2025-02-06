import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Dashboard } from '@/components/pages/Dashboard/Dashboard';
import { LoginPage } from '@/components/pages/auth/LoginPage';
import { SignupPage } from '@/components/pages/auth/SignupPage';
import { Wallet } from '@/components/pages/Wallet/Wallet';
import { Marketplace } from '@/components/pages/Marketplace/Marketplace';
import { Analysis } from '@/components/pages/Analysis/Analysis';
import { CommissionRate } from '@/components/pages/Commission/CommissionRate';
import { CommissionAnalysis } from '@/components/pages/Commission/CommissionAnalysis';
import AdminDashboard from '@/components/pages/AdminDashboard/AdminDashboard';

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
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/commission-rate" element={<CommissionRate />} />
                <Route path="/commission-analysis" element={<CommissionAnalysis />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

        </Routes>
    );
};