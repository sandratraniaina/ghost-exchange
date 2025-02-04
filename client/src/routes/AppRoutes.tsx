import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DashboardPage } from '@/components/pages/DashboardPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>
        </Routes>
    );
};