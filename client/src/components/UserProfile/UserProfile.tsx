import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from '../layouts/DarkModeToggle';

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="inline-flex items-center space-x-2 rounded-lg p-2 shadow-sm min-w-fit">
      <DarkModeToggle></DarkModeToggle>
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>

      <div className="text-left whitespace-nowrap">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.role}</div>
      </div>

      <LogOut
        className="h-5 w-5 text-gray-500 ml-2 cursor-pointer hover:text-red-500 transition-colors"
        onClick={() => { logout() }}
      />
    </div>
  );
};

export default UserProfile;
