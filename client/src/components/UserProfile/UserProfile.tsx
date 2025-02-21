import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="inline-flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm min-w-fit">
      <Avatar>
        <AvatarImage src={user.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} alt={user.username} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>

      <div className="text-left whitespace-nowrap">
        <div className="font-medium">{user.username}</div>
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
