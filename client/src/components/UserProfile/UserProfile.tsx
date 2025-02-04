import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = ({ user = { 
  name: 'John Doe', 
  role: 'Verified Trader',
  avatar: '/api/placeholder/32/32',
}}) => {
  return (
    <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 cursor-pointer">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      
      <div className="text-left">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.role}</div>
      </div>
      
      <LogOut 
        className="h-5 w-5 text-gray-500 ml-2 cursor-pointer" 
        onClick={() => { /* TODO: Handle logout action */ }}
      />
    </div>
  );
};

export default UserProfile;
