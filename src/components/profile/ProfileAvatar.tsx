
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/user";

interface ProfileAvatarProps {
  profile: UserProfile;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile, size = "md" }) => {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={`${sizeClass[size]} border-2 border-white bg-gradient-to-br from-blue-400 to-purple-600`}>
      {profile.avatar_url && (
        <AvatarImage 
          src={profile.avatar_url} 
          alt={profile.name || "User"} 
        />
      )}
      <AvatarFallback className="text-white font-medium">
        {getInitials(profile.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
