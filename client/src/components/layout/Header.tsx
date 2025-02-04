import { useAuth } from '@/hooks/useAuth';
import { BaseProps } from '@/types/common';

interface HeaderProps extends BaseProps {
    title?: string;
    className?: string
}

export const Header: React.FC<HeaderProps> = ({
    title = 'My Application',
    className = ''
}) => {
    const { user, logout } = useAuth();

    return (
        <header className={`h-16 border-b bg-white flex items-center justify-between px-6 ${className}`}>
            <h1 className="text-xl font-bold">{title}</h1>
            {user && (
                <div className="flex items-center space-x-4">
                    <span>{user.name}</span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};