import { BaseProps } from '@/types/common';
import UserProfile from '../UserProfile/UserProfile';
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps extends BaseProps {
    title?: string;
    className?: string
}

export const Header: React.FC<HeaderProps> = ({
    title = 'My Application',
    className = ''
}) => {
    return (
        <header className={`h-16 border-b flex items-center justify-between px-6 ${className}`}>
            <div className='inline-flex items-center gap-5'>
                <h1 className="text-xl font-bold">{title}</h1>
                <DarkModeToggle></DarkModeToggle>
            </div>
            <UserProfile />
        </header>
    );
};