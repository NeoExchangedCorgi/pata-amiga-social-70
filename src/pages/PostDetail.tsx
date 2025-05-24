import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import CommentForm from '@/components/CommentForm';
import CommentCard from '@/components/CommentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, ArrowLeft, Flag, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  author: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isOwnComment?: boolean;
  replies?: Comment[];
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Mock post data baseado no ID - em uma aplicação real viria de uma API
  const getPostData = (postId: string) => {
    const posts = {
      '1': {
        id: '1',
        author: 'Maria Silva',
        username: 'maria_defensora',
        content: 'Encontrei um cachorrinho ferido na Rua das Flores, 123. Ele está com uma pata machucada e muito assustado. Alguém pode ajudar com o resgate?',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
        timestamp: '2h',
        likes: 15,
        replies: 3,
      },
      '2': {
        id: '2',
        author: 'João Santos',
        username: 'joao_amigo_pets',
        content: 'Urgente! Gata prenha abandonada na Praça Central. Ela está muito magra e precisa de cuidados veterinários. Já contatei a ONG, mas precisamos de ajuda para o transporte.',
        timestamp: '4h',
        likes: 28,
        replies: 7,
      },
      '3': {
        id: '3',
        author: 'Ana Costa',
        username: 'ana_ong_helper',
        content: 'Atualização: O cãozinho que resgatamos ontem já está melhor! Obrigada a todos que ajudaram. Ele ainda precisa de um lar definitivo. 🐕❤️',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
        timestamp: '6h',
        likes: 42,
        replies: 12,
      }
    };
    
    return posts[postId as keyof typeof posts] || posts['1'];
  };

  const postData = getPostData(id || '1');
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(postData.likes);
  const [isReported, setIsReported] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Carlos Silva',
      username: 'carlos_vet',
      content: 'Posso ajudar! Sou veterinário e tenho experiência com resgates. Onde exatamente você encontrou o cachorro?',
      timestamp: '1h',
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: '2',
          author: postData.author,
          username: postData.username,
          content: 'Obrigada, Carlos! Ele está na Rua das Flores, número 123. Você pode ir até lá?',
          timestamp: '45min',
          likes: 1,
          isLiked: false,
          isOwnComment: user?.username === postData.username,
        }
      ]
    },
    {
      id: '3',
      author: 'Ana Costa',
      username: 'ana_ong_helper',
      content: 'Já entrei em contato com a ONG Paraíso dos Focinhos. Eles podem ajudar com o transporte se alguém conseguir fazer o primeiro atendimento.',
      timestamp: '30min',
      likes: 5,
      isLiked: true,
    }
  ]);

  const post = {
    ...postData,
    isLiked: isLiked,
    likes: likesCount,
    replies: comments.length,
    isOwnPost: user?.username === postData.username,
  };

  const handleLike = () => {
    if (!post.isOwnPost && isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleReport = () => {
    if (isAuthenticated) {
      setIsReported(!isReported);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user/${post.username}`);
  };

  const addComment = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user?.fullName || 'Usuário',
      username: user?.username || 'usuario',
      content,
      timestamp: 'agora',
      likes: 0,
      isLiked: false,
      isOwnComment: true,
      replies: []
    };

    if (parentId) {
      // Adicionar como resposta
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          } else if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies)
            };
          }
          return comment;
        });
      };
      setComments(addReplyToComment(comments));
    } else {
      // Adicionar como comentário principal
      setComments([...comments, newComment]);
    }
  };

  const handleCommentLike = (commentId: string) => {
    console.log('Curtir comentário:', commentId);
  };

  const handleCommentReport = (commentId: string) => {
    console.log('Denunciar comentário:', commentId);
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
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                        {post.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 
                          className="font-semibold text-foreground cursor-pointer hover:underline"
                          onClick={handleAuthorClick}
                        >
                          {post.author}
                        </h3>
                        <span className="text-muted-foreground">@{post.username}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{post.timestamp}</span>
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
                      {post.isOwnPost ? (
                        <>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </>
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

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center space-x-6 pt-4 border-t border-foreground/10">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLike}
                    disabled={post.isOwnPost || !isAuthenticated}
                    className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} ${(post.isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {comments.length}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-4">Comentários</h4>
                
                <CommentForm onSubmit={addComment} />
                
                <div className="mt-6 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        onReply={addComment}
                        onLike={handleCommentLike}
                        onReport={handleCommentReport}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Seja o primeiro a comentar!
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
