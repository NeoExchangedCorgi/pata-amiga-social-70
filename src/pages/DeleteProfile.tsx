
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';

const DeleteProfile = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (!user || !profile) return;

    if (confirmationText !== 'DELETAR') {
      toast({
        title: "Erro",
        description: "Digite 'DELETAR' para confirmar a exclusão do perfil.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      // Get the current session to include the JWT token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erro",
          description: "Sessão não encontrada. Faça login novamente.",
          variant: "destructive",
        });
        return;
      }

      // Call the Edge Function to delete the user account
      const response = await fetch(`https://yreltrccpkraxsbmwlyg.supabase.co/functions/v1/delete-user-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error deleting profile:', result);
        toast({
          title: "Erro",
          description: result.error || "Erro ao deletar o perfil. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Perfil deletado",
        description: "Seu perfil foi deletado com sucesso. Você será redirecionado.",
      });

      // Logout and redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Perfil
            </Button>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Deletar Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    ⚠️ ATENÇÃO: Esta ação é irreversível!
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Ao deletar seu perfil, os seguintes dados serão permanentemente removidos:
                  </p>
                  <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm mt-2 space-y-1">
                    <li>Seu perfil e todas as informações pessoais</li>
                    <li>Todas as suas postagens e mídia</li>
                    <li>Todos os seus comentários</li>
                    <li>Suas curtidas e interações</li>
                    <li>Histórico de visualizações</li>
                    <li>Notificações relacionadas</li>
                    <li>Sua conta de acesso</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="confirmation" className="text-foreground">
                    Para confirmar, digite <span className="font-bold text-red-600 dark:text-red-400">DELETAR</span> no campo abaixo:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Digite DELETAR para confirmar"
                    className="mt-2"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="flex-1"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProfile}
                    disabled={isDeleting || confirmationText !== 'DELETAR'}
                    className="flex-1"
                  >
                    {isDeleting ? 'Deletando...' : 'Deletar Perfil'}
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

export default DeleteProfile;
