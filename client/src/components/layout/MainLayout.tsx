import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { BaseProps } from '@/types/common';

export const MainLayout: React.FC<BaseProps> = ({ className = '' }) => {
    return (
        <div className={`min-h-screen flex flex-col ${className}`}>
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};