
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ProfileAvatar from "./ProfileAvatar";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/user";

const ProfileSettings: React.FC = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        account_type: user.account_type || 'student',
      });
    }
  }, [user, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (profile) {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsUpdating(true);
    try {
      await updateUserProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        {user && (
          <ProfileAvatar profile={user} size="xl" />
        )}
        <div>
          <h3 className="text-lg font-medium">{user?.name || 'User'}</h3>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-medium rounded-full">
              {user?.account_type || 'Student'}
            </span>
            {user?.institution_name && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-xs font-medium rounded-full">
                {user.institution_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            name="name"
            value={profile.name || ''}
            onChange={handleInputChange}
            placeholder="Enter your display name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={profile.bio || ''}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
