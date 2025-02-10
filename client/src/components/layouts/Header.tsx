import { BaseProps } from '@/types/common';
import UserProfile from '../UserProfile/UserProfile';
import { Link } from 'react-router-dom';

interface HeaderProps extends BaseProps {
    title?: string;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Ghost Exchange',
    className = ''
}) => {
    return (
        <header className={`h-16 border-b bg-white flex items-center justify-between px-6 ${className}`}>
            <Link to="/home" className="text-xl font-bold hover:underline">
                {title}
            </Link>
            <UserProfile />
        </header>
    );
};