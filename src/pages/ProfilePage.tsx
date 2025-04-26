
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/animations/PageTransition';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailPreferences from '@/components/profile/EmailPreferences';
import SupportPanel from '@/components/profile/SupportPanel';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/use-toast';
import { User, LogOut, HelpCircle, Mail, Settings } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Force logout to ensure complete session clearing
      await logout();
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account',
        variant: 'default',
      });
      
      // Redirect to landing page
      navigate('/landing');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error logging out',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-8 mb-10">
          <ProfileHeader user={user} />
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Support</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card rounded-lg border shadow-sm">
                <EditProfileForm />
              </div>
              
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Account Settings
                </h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to log back in to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <EmailPreferences />
            </TabsContent>
            
            <TabsContent value="support">
              <SupportPanel />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProfilePage;
