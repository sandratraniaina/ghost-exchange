import { HomeIcon, UserIcon, SettingsIcon } from 'lucide-react';
import { BaseProps } from '@/types/common';

interface NavItem {
    path: string;
    label: string;
    icon: React.FC<{ className?: string }>;
}

export const Sidebar: React.FC<BaseProps> = ({ className = '' }) => {
    const navItems: NavItem[] = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/profile', label: 'Profile', icon: UserIcon },
        { path: '/settings', label: 'Settings', icon: SettingsIcon }
    ];

    return (
        <div className={`h-full w-64 bg-gray-50 border-r p-4 ${className}`}>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <a
                        key={item.path}
                        href={item.path}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
};