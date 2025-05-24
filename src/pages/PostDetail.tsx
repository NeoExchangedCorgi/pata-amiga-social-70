
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import CommentForm from '@/components/CommentForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, ArrowLeft, Flag, MoreHorizontal, Trash2, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import type { Post } from '@/hooks/usePosts';

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, isPostReported } = usePostReports();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;

      try {
        // Buscar dados do post
        const { data: postData, error: postError } = await supabase
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
          .eq('id', id)
          .single();

        if (postError || !postData) {
          console.error('Error fetching post:', postError);
          setIsLoading(false);
          return;
        }

        setPost(postData);

        // Buscar comentários do post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: true });

        if (!commentsError && commentsData) {
          setComments(commentsData);
        }

        // Registrar visualização
        if (user && postData) {
          addPostView(postData.id);
        }

      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [id, user, addPostView]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Post não encontrado.</p>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  const isOwnPost = user?.id === post.author_id;
  const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = comments.length;
  const isSaved = isPostSaved(post.id);
  const isReported = isPostReported(post.id);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(post.id);
    }
  };

  const handleReport = async () => {
    if (isAuthenticated && !isOwnPost) {
      await reportPost(post.id);
    }
  };

  const handleDelete = async () => {
    if (isOwnPost) {
      const success = await deletePost(post.id);
      if (success) {
        navigate('/');
      }
    }
  };

  const handleMark = () => {
    if (isAuthenticated) {
      toggleSavePost(post.id);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user/${post.profiles.username}`);
  };

  const addComment = async (content: string) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: post.id,
          author_id: user.id,
        })
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (!error && data) {
        setComments([...comments, data]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
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
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <Card className="border-foreground/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="cursor-pointer" onClick={handleAuthorClick}>
                      <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                        {post.profiles.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 
                          className="font-semibold text-foreground cursor-pointer hover:underline"
                          onClick={handleAuthorClick}
                        >
                          {post.profiles.full_name}
                        </h3>
                        <span className="text-muted-foreground">@{post.profiles.username}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{formatTimeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isOwnPost ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <DropdownMenuItem onClick={handleReport}>
                          <Flag className="h-4 w-4 mr-2" />
                          {isReported ? 'Denunciado' : 'Denunciar'}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post content"
                    className="w-full rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center space-x-4 pt-4 border-t border-foreground/10">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    disabled={isOwnPost || !isAuthenticated}
                    className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {likesCount}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {commentsCount}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMark}
                    disabled={isOwnPost || !isAuthenticated}
                    className={`${isSaved ? 'text-blue-500 hover:text-blue-600' : 'text-muted-foreground hover:text-blue-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Marcado' : 'Marcar'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-4">Comentários</h4>
                
                {isAuthenticated && <CommentForm onSubmit={addComment} />}
                
                <div className="mt-6 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-b border-foreground/10 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xs">
                              {comment.profiles.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-foreground text-sm">{comment.profiles.full_name}</span>
                              <span className="text-muted-foreground text-xs">@{comment.profiles.username}</span>
                              <span className="text-muted-foreground text-xs">·</span>
                              <span className="text-muted-foreground text-xs">{formatTimeAgo(comment.created_at)}</span>
                            </div>
                            <p className="text-foreground text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isAuthenticated ? 'Seja o primeiro a comentar!' : 'Faça login para ver e adicionar comentários.'}
                    </p>
                  )}
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

export default PostDetail;
