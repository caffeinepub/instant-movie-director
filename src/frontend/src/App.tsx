import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import StudioLayout from './features/layout/StudioLayout';
import LoginButton from './features/auth/LoginButton';
import ProfileSetupDialog from './features/auth/ProfileSetupDialog';
import ProjectSwitcher from './features/projects/components/ProjectSwitcher';
import ExportButtons from './features/export/ExportButtons';
import ProjectOutlinePanel from './features/workspace/components/ProjectOutlinePanel';
import RolePromptBoard from './features/workspace/components/RolePromptBoard';
import AssemblyPanel from './features/assembly/AssemblyPanel';
import { useCurrentUser } from './features/auth/useCurrentUser';
import { useProjects } from './features/projects/useProjects';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import BrandLogo from './features/assets/BrandLogo';

export default function App() {
  const { isAuthenticated, userProfile, isProfileLoading, isFetched } = useCurrentUser();
  const { currentProject, isAnonymous } = useProjects();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isProfileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, isProfileLoading, isFetched, userProfile]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <StudioLayout
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <BrandLogo />
              <ProjectSwitcher />
            </div>
            <div className="flex items-center gap-4">
              <ExportButtons />
              <LoginButton />
            </div>
          </div>
        }
      >
        {isAnonymous && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              You're working in draft mode. Sign in to save your projects permanently.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProjectOutlinePanel />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="prompts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompts">Role Prompts</TabsTrigger>
                <TabsTrigger value="assembly">Assembly</TabsTrigger>
              </TabsList>
              <TabsContent value="prompts" className="mt-6">
                <RolePromptBoard />
              </TabsContent>
              <TabsContent value="assembly" className="mt-6">
                <AssemblyPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <ProfileSetupDialog open={showProfileSetup} onOpenChange={setShowProfileSetup} />
      </StudioLayout>
      <Toaster />
    </ThemeProvider>
  );
}
