
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
import { User, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/hooks/usePosts';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  created_at: string;
  avatar_url?: string;
}

interface UserComment {
  id: string;
  content: string;
  created_at: string;
  posts: {
    id: string;
    content: string;
    author_id: string;
    profiles: {
      username: string;
      full_name: string;
    };
  };
}

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            profiles (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes (
              user_id
            ),
            comments (
              id
            )
          `)
          .eq('author_id', profileData.id)
          .order('created_at', { ascending: false });

        if (!postsError && postsData) {
          setPosts(postsData);
        }

        // Buscar comentários do usuário
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            posts (
              id,
              content,
              author_id,
              profiles (
                username,
                full_name
              )
            )
          `)
          .eq('author_id', profileData.id)
          .order('created_at', { ascending: false });

        if (!commentsError && commentsData) {
          setComments(commentsData);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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
                    </CardTitle>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>
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
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{comments.length}</p>
                    <p className="text-sm text-muted-foreground">Comentários</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
                <TabsTrigger value="comments">Comentários ({comments.length})</TabsTrigger>
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

              <TabsContent value="comments" className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum comentário encontrado.</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="border-foreground/20">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Comentário em post de @{comment.posts.profiles.username}
                          </p>
                          <p className="text-foreground">{comment.content}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/post/${comment.posts.id}`)}
                              className="text-primary hover:text-primary/80"
                            >
                              Ver post
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default UserProfile;
