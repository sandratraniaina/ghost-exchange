import { BaseProps } from '@/types/common';
import UserProfile from '../UserProfile/UserProfile';

interface HeaderProps extends BaseProps {
    title?: string;
    className?: string
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Ghost Exchange',
    className = ''
}) => {
    return (
        <header className={`h-16 border-b bg-white flex items-center justify-between px-6 ${className}`}>
            <h1 className="text-xl font-bold">{title}</h1>
            <UserProfile />
        </header>
    );
};