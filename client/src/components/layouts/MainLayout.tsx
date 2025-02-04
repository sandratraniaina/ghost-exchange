import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';
import { BaseProps } from '@/types/common';

export const MainLayout: React.FC<BaseProps> = ({ className = '' }) => {
    return (
        <div className={`min-h-screen flex flex-col w-full h-full ${className}`}>
            <Header />
            <div className="flex flex-1 h-full">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};