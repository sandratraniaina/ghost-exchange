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
import { UserActivity } from '@/components/pages/UserActivity/UserActivity';
import { UserTransactionHistory } from '@/components/pages/UserActivityHistory/UserTransactionHistory';
import { UserCryptoHistory } from '@/components/pages/UserActivityHistory/UserCryptoHistory';
import ErrorPage from '@/components/pages/common/ErrorPage';
import { RoleBasedRoute } from './RoleBaseRoute';
import Home from '@/components/pages/common/HomePage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/error" element={<ErrorPage />} />

            {/* Admin routes */}
            <Route element={<MainLayout />}>
                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleBasedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </RoleBasedRoute>
                    }
                />
            </Route>

            {/* Client routes */}
            <Route element={<MainLayout />}>
                <Route
                    path="/home"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                            <Home></Home>
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <Dashboard />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/wallet"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <Wallet />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/marketplace"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <Marketplace />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/analysis"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <Analysis />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/commission-rate"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <CommissionRate />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/commission-analysis"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <CommissionAnalysis />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/user-activity"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <UserActivity />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/user-activity/history/transaction"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <UserTransactionHistory />
                        </RoleBasedRoute>
                    }
                />
                <Route
                    path="/user-activity/history/crypto"
                    element={
                        <RoleBasedRoute allowedRoles={['CLIENT']}>
                            <UserCryptoHistory />
                        </RoleBasedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};