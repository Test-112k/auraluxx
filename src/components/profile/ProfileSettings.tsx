import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Eye, EyeOff, Palette, User, Mail, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface ProfileSettingsProps {
  onClose: () => void;
}

const ProfileSettings = ({ onClose }: ProfileSettingsProps) => {
  const { user, updateUserEmail, updateUserPassword } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your current password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserEmail(newEmail, currentPassword);
      toast({
        title: 'Success',
        description: 'Email updated successfully',
      });
      setIsEmailMode(false);
      setCurrentPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(newPassword, currentPassword);
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      setIsPasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEmailMode(false);
    setIsPasswordMode(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNewEmail(user?.email || '');
  };

  return (
    <Dialog open={true} onOpenChange={() => { resetForm(); onClose(); }}>
      <DialogContent className="bg-aura-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Account Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!isEmailMode && !isPasswordMode && (
            <>
              {/* Account Information */}
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-aura-purple" />
                  <h3 className="font-semibold text-white">Account Information</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Current Email</Label>
                  <div className="text-white font-medium">{user?.email}</div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-aura-purple" />
                  <h3 className="font-semibold text-white">Theme Settings</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Appearance</div>
                    <div className="text-white/60 text-sm">Choose your preferred theme</div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-aura-purple" />
                  <h3 className="font-semibold text-white">Security</h3>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => setIsEmailMode(true)}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Change Email
                  </Button>
                  <Button
                    onClick={() => setIsPasswordMode(true)}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </>
          )}

          {isEmailMode && (
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-sm font-medium text-white/80">
                  New Email
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium text-white/80">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEmailMode(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-aura-purple hover:bg-aura-purple/80"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </Button>
              </div>
            </form>
          )}

          {isPasswordMode && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password-2" className="text-sm font-medium text-white/80">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password-2"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-white/80">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-white/80">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordMode(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-aura-purple hover:bg-aura-purple/80"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;