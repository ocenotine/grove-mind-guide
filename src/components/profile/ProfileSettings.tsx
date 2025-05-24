
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const { user } = useAuthStore();
  
  const handleSave = () => {
    toast({
      title: "Settings updated",
      description: "Your profile settings have been saved."
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display-name">Display Name</Label>
        <Input 
          id="display-name" 
          defaultValue={user?.user_metadata?.name || user?.email?.split('@')[0] || ''} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          defaultValue={user?.email || ''} 
          disabled 
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Input 
          id="timezone" 
          defaultValue="UTC" 
        />
      </div>
      
      <Button onClick={handleSave} className="mt-2">Save Changes</Button>
    </div>
  );
};

export default ProfileSettings;
