
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { commentsApi } from '@/services/commentsApi';
import type { Comment, CommentSortType } from '@/types/comment';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<CommentSortType>('chronological');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!postId) return;
    
    setIsLoading(true);
    try {
      const data = await commentsApi.fetchComments(postId, sortType);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (content: string, parentCommentId?: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await commentsApi.createComment(postId, content, parentCommentId, user.id);
      
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      
      toast({
        title: "Comentário adicionado!",
        description: parentCommentId ? "Resposta publicada com sucesso." : "Comentário publicado com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comentário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    if (!user) return false;

    try {
      const result = await commentsApi.updateComment(commentId, content, user.id);
      
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      
      toast({
        title: "Comentário atualizado!",
        description: "Comentário editado com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating comment:', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const success = await commentsApi.deleteComment(commentId, user.id);
      
      if (!success) {
        toast({
          title: "Erro",
          description: "Erro ao excluir comentário. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      
      toast({
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para curtir comentários",
        variant: "destructive",
      });
      return false;
    }

    try {
      const success = await commentsApi.toggleCommentLike(commentId, user.id);
      
      if (!success) {
        toast({
          title: "Erro",
          description: "Erro ao curtir comentário. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return false;
    }
  };

  const isCommentLiked = (comment: Comment) => {
    if (!user) return false;
    return comment.comment_likes?.some(like => like.user_id === user.id) || false;
  };

  const isCommentOwner = (comment: Comment) => {
    if (!user) return false;
    return comment.author_id === user.id;
  };

  useEffect(() => {
    fetchComments();
  }, [postId, sortType]);

  return {
    comments,
    isLoading,
    sortType,
    setSortType,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCommentLiked,
    isCommentOwner,
    refetch: fetchComments,
  };
};
