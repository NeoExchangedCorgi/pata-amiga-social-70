
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

  // Mock user data baseado no username - em uma aplicação real viria de uma API
  const getUserData = (username: string) => {
    const users = {
      'maria_defensora': {
        fullName: 'Maria Silva',
        username: 'maria_defensora',
        bio: 'Defensora dos animais há 5 anos. Sempre disposta a ajudar no resgate de pets abandonados.',
        joinDate: '2020-03-15T00:00:00.000Z',
        postsCount: 24,
        followersCount: 156,
        followingCount: 89,
      },
      'joao_amigo_pets': {
        fullName: 'João Santos',
        username: 'joao_amigo_pets',
        bio: 'Amante dos animais e voluntário em várias ONGs. Ajudo com resgates e adoções.',
        joinDate: '2019-08-20T00:00:00.000Z',
        postsCount: 47,
        followersCount: 203,
        followingCount: 134,
      },
      'ana_ong_helper': {
        fullName: 'Ana Costa',
        username: 'ana_ong_helper',
        bio: 'Coordenadora da ONG Paraíso dos Focinhos. Dedicada ao bem-estar animal.',
        joinDate: '2018-12-10T00:00:00.000Z',
        postsCount: 89,
        followersCount: 542,
        followingCount: 67,
      },
      'carlos_vet': {
        fullName: 'Carlos Silva',
        username: 'carlos_vet',
        bio: 'Veterinário especializado em resgates e cuidados emergenciais. Disponível para ajudar.',
        joinDate: '2021-01-15T00:00:00.000Z',
        postsCount: 35,
        followersCount: 298,
        followingCount: 45,
      }
    };
    
    return users[username as keyof typeof users] || {
      fullName: 'Usuário',
      username: username || 'usuario',
      bio: 'Perfil não encontrado.',
      joinDate: '2023-01-01T00:00:00.000Z',
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
    };
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
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{profileUser.followersCount}</p>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{profileUser.followingCount}</p>
                    <p className="text-sm text-muted-foreground">Seguindo</p>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  Seguir
                </Button>
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
