
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { formatDateBR, getUserInitials, abbreviateName } from '@/utils/formatters';
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

  const handleUnhideProfile = async (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    e.preventDefault();
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
                      <div 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => handleProfileClick(hiddenProfile.profiles.username)}
                      >
                        <Avatar className="flex-shrink-0">
                          <AvatarImage src={hiddenProfile.profiles.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
                            {getUserInitials(hiddenProfile.profiles.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {abbreviateName(hiddenProfile.profiles.full_name, 25)}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                @{hiddenProfile.profiles.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Ocultado em {formatDateBR(hiddenProfile.hidden_at)}
                              </p>
                            </div>
                            
                            <div 
                              className="flex-shrink-0 ml-4 p-2 rounded-full hover:bg-accent transition-colors"
                              onClick={(e) => handleUnhideProfile(e, hiddenProfile.hidden_profile_id)}
                              title="Desocultar perfil"
                            >
                              <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </div>
                          </div>
                        </div>
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
