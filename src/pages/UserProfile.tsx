
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  // Mock user data based on username
  const getUserData = (username: string) => {
    const users: { [key: string]: any } = {
      'maria_defensora': {
        fullName: 'Maria Silva',
        username: 'maria_defensora',
        bio: 'Defensora dos animais há 5 anos. Sempre disposta a ajudar no resgate de pets abandonados.',
        joinDate: '2020-03-15T00:00:00.000Z',
        postsCount: 24,
      },
      'joao_amigo_pets': {
        fullName: 'João Santos',
        username: 'joao_amigo_pets',
        bio: 'Veterinário apaixonado por animais. Atendimento de emergência para pets abandonados.',
        joinDate: '2019-08-20T00:00:00.000Z',
        postsCount: 18,
      },
      'ana_ong_helper': {
        fullName: 'Ana Costa',
        username: 'ana_ong_helper',
        bio: 'Voluntária da ONG Paraíso dos Focinhos. Ajudo com resgates e adoções.',
        joinDate: '2021-01-10T00:00:00.000Z',
        postsCount: 32,
      },
      'carlos_vet': {
        fullName: 'Carlos Silva',
        username: 'carlos_vet',
        bio: 'Veterinário especialista em animais de rua. Consultas gratuitas para pets resgatados.',
        joinDate: '2018-05-12T00:00:00.000Z',
        postsCount: 45,
      }
    };
    
    return users[username || 'maria_defensora'] || users['maria_defensora'];
  };

  const profileUser = getUserData(username || '');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <Card className="border-foreground/20">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {profileUser.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{profileUser.fullName}</span>
                    </CardTitle>
                    <p className="text-muted-foreground">@{profileUser.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileUser.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="text-foreground">{profileUser.bio}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Membro desde {new Date(profileUser.joinDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex space-x-6 pt-4 border-t border-foreground/10">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{profileUser.postsCount}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default UserProfile;
