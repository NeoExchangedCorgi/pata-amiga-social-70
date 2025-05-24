
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Mail, Phone } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Meu Perfil</h1>
            
            <Card className="border-foreground/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="text-foreground font-medium">{user.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Nome de Usuário</p>
                  <p className="text-foreground font-medium">@{user.username}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Membro desde {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Editar Perfil
                  </Button>
                  <Button variant="outline" className="w-full">
                    Alterar Senha
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Excluir Conta
                  </Button>
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

export default Profile;
