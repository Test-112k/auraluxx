import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserIcon, LogOut as LogoutIcon, Timer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProfileSettings from './ProfileSettings';
import AdFreeRewards from './AdFreeRewards';

const ProfileDropdown = () => {
  const { user, logout, userData, isAdFree, adFreeTimeLeft } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showAdFree, setShowAdFree] = useState(false);

  if (!user) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getUserInitials = () => {
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-aura-purple to-aura-accent text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-aura-dark border-white/10" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-aura-purple to-aura-accent text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {user.email}
              </p>
              {isAdFree && (
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400 font-mono animate-pulse">
                    {formatTime(adFreeTimeLeft)} Ad-Free
                  </span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          
          <DropdownMenuItem 
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-white/10 focus:bg-white/10"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setShowAdFree(true)}
            className="text-white hover:bg-white/10 focus:bg-white/10"
          >
            <div className="mr-2 text-lg">🎁</div>
            <span>Ad-Free Time</span>
            {isAdFree && (
              <span className="ml-auto text-xs text-green-400 font-mono">
                {formatTime(adFreeTimeLeft)}
              </span>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10"
          >
            <LogoutIcon className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSettings && (
        <ProfileSettings onClose={() => setShowSettings(false)} />
      )}
      
      {showAdFree && (
        <AdFreeRewards onClose={() => setShowAdFree(false)} />
      )}
    </>
  );
};

export default ProfileDropdown;