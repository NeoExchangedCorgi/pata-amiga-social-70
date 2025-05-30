
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User, Calendar, ArrowLeft, Trash2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActions } from '@/hooks/useAdminActions';
import type { Post } from '@/hooks/usePosts';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  user_type: 'user' | 'admin';
  created_at: string;
  avatar_url?: string;
}

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isAdmin, deleteUser } = useAdminActions();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;

      try {
        // Buscar perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError || !profileData) {
          console.error('Error fetching profile:', profileError);
          setIsLoading(false);
          return;
        }

        setProfile(profileData);

        // Buscar posts do usuário
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url,
              user_type
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          `)
          .eq('author_id', profileData.id)
          .order('created_at', { ascending: false });

        if (!postsError && postsData) {
          setPosts(postsData);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleDeleteUser = async () => {
    if (!profile) return;

    const success = await deleteUser(profile.id);
    if (success) {
      setShowDeleteDialog(false);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Usuário não encontrado.</p>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  const isAdminProfile = profile.user_type === 'admin';

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

            <Card className={`border-foreground/20 ${
              isAdminProfile ? 'bg-red-50/30 dark:bg-red-950/10 border-red-200/50 dark:border-red-800/30' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        profile.full_name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-foreground flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>{profile.full_name}</span>
                        {isAdminProfile && (
                          <Shield className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground">@{profile.username}</p>
                      {isAdminProfile && (
                        <p className="text-sm text-red-600 dark:text-red-400">Administrador</p>
                      )}
                    </div>
                  </div>
                  
                  {isAdmin && !isAdminProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar Perfil
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="text-foreground">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex space-x-6 pt-4 border-t border-foreground/10">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{posts.length}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum post encontrado.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="animate-fade-in">
                      <PostCard post={post} />
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Perfil de Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar permanentemente o perfil de {profile.full_name}? 
              Esta ação irá remover todos os dados do usuário, incluindo posts, curtidas e histórico.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser} 
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfile;
