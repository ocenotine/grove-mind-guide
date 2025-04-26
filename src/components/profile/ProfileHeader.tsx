
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PencilLine, LogOut, Camera, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error instanceof Error ? error.message : 'An error occurred during logout',
        variant: 'destructive',
      });
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: 'File too large',
          description: 'Avatar image must be less than 2MB',
          variant: 'destructive'
        });
        return;
      }
      
      setNewAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setIsEditingAvatar(true);
    }
  };
  
  const handleSaveAvatar = async () => {
    if (!newAvatarFile || !user) return;
    
    try {
      // Get file extension
      const fileExt = newAvatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, newAvatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update user profile
      await updateProfile({
        avatarUrl: publicUrl
      });
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully'
      });
      
      setIsEditingAvatar(false);
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
      
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Avatar update failed',
        description: error instanceof Error ? error.message : 'Failed to update avatar',
        variant: 'destructive'
      });
    }
  };
  
  const cancelAvatarEdit = () => {
    setIsEditingAvatar(false);
    setNewAvatarFile(null);
    setNewAvatarPreview(null);
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (!user) return null;

  return (
    <div className="bg-card border rounded-lg p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-primary">
            {(isEditingAvatar && newAvatarPreview) ? (
              <AvatarImage src={newAvatarPreview} alt={user.name || 'User'} />
            ) : user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/10">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {isEditingAvatar ? (
            <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-1">
              <Button
                size="icon"
                variant="default"
                className="h-7 w-7 rounded-full"
                onClick={handleSaveAvatar}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full"
                onClick={cancelAvatarEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          
          {user.bio && (
            <p className="text-sm mt-2">{user.bio}</p>
          )}
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              {user.account_type === 'admin' ? 'Administrator' : 
               user.account_type === 'institution' ? 'Institution' : 'Student'}
            </div>
            
            <div className="text-xs bg-muted px-3 py-1 rounded-full">
              {user.document_count || 0} Documents
            </div>
            
            <div className="text-xs bg-muted px-3 py-1 rounded-full">
              {user.flashcard_count || 0} Flashcards
            </div>
            
            <div className="text-xs bg-muted px-3 py-1 rounded-full">
              {user.streak_count || 0} Day Streak
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/profile/edit">
              <PencilLine className="h-4 w-4" />
              <span>Edit Profile</span>
            </a>
          </Button>
          
          <Button variant="ghost" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
