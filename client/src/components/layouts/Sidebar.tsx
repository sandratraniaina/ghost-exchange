import { HomeIcon, ShoppingCart, Wallet, BarChart2, Calculator, ActivitySquare, User, History, Shield } from 'lucide-react';
import { BaseProps } from '@/types/common';
import { Link } from 'react-router-dom';

interface NavItem {
    path: string;
    label: string;
    icon: React.FC<{ className?: string }>;
    children?: NavItem[];
}

export const Sidebar: React.FC<BaseProps> = ({ className = '' }) => {
    const navItems: NavItem[] = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
        { path: '/wallet', label: 'Wallet', icon: Wallet },
        { path: '/analysis', label: 'Analysis', icon: BarChart2 },
        {
            path: '/commission-rate',
            label: 'Commission',
            icon: Calculator,
            children: [
                { path: '/commission-rate', label: 'Commission Rate', icon: Calculator },
                { path: '/commission-analysis', label: 'Commission Analysis', icon: BarChart2 },
            ]
        },
        {
            path: '/user-activity',
            label: 'User Activity',
            icon: ActivitySquare,
            children: [
                { path: '/user-activity', label: 'Activity Overview', icon: User },
                { path: '/user-activity/history/transaction', label: 'Transaction History', icon: History },
                { path: '/user-activity/history/crypto', label: 'Crypto History', icon: History },
            ]
        },
        { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
    ];

    const renderNavItem = (item: NavItem) => (
        <div key={item.path}>
            <Link
                to={item.path}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-black hover:underline"
            >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
            </Link>
            {item.children && (
                <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                        <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:underline text-sm"
                        >
                            <child.icon className="w-4 h-4" />
                            <span>{child.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-64 bg-gray-50 border-r p-4 ${className}`}>
            <nav className="space-y-2 w-full">
                {navItems.map(renderNavItem)}
            </nav>
        </div>
    );
};