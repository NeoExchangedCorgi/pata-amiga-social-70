
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { formatDateBR, getUserInitials } from '@/utils/formatters';
import { ROUTES } from '@/constants/app';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const HiddenProfiles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hiddenProfiles, isLoading, unhideProfile } = useHiddenProfiles();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleUnhideProfile = async (profileId: string) => {
    await unhideProfile(profileId);
  };

  const handleProfileClick = (username: string) => {
    navigate(ROUTES.USER_PROFILE(username));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
        <ScrollToTopButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Perfis Ocultos</h1>
              <p className="text-muted-foreground">
                Perfis que você ocultou da sua feed. Você pode desocultar qualquer um deles.
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-20"></div>
                  </div>
                ))}
              </div>
            ) : hiddenProfiles.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum perfil ocultado
                  </h3>
                  <p className="text-muted-foreground">
                    Você ainda não ocultou nenhum perfil da sua feed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {hiddenProfiles.map((hiddenProfile) => (
                  <Card 
                    key={hiddenProfile.id} 
                    className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer flex-1"
                          onClick={() => handleProfileClick(hiddenProfile.profiles.username)}
                        >
                          <Avatar>
                            <AvatarImage src={hiddenProfile.profiles.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
                              {getUserInitials(hiddenProfile.profiles.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {hiddenProfile.profiles.full_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              @{hiddenProfile.profiles.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ocultado em {formatDateBR(hiddenProfile.hidden_at)}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnhideProfile(hiddenProfile.hidden_profile_id)}
                          className="border-pata-blue-light dark:border-pata-blue-dark text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Desocultar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
      <ScrollToTopButton />
    </div>
  );
};

export default HiddenProfiles;
