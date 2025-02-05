import { HomeIcon, ShoppingCart, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BaseProps } from '@/types/common';

interface NavItem {
    path: string;
    label: string;
    icon: React.FC<{ className?: string }>;
}

export const Sidebar: React.FC<BaseProps> = ({ className = '' }) => {
    const navItems: NavItem[] = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
        { path: '/wallet', label: 'Wallet', icon: Wallet }
    ];

    return (
        <div className={`w-64 border-r p-4 ${className}`}>   
            <nav className="space-y-2 w-full">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-3 p-3 rounded-lg transition-colors 
                                   hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 
                                   dark:text-gray-300 font-medium"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};
