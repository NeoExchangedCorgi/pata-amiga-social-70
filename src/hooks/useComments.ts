
import { useState, useEffect } from 'react';
import { commentsApi } from '@/services/commentsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Comment, CommentSortType } from '@/types/comment';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortType, setSortType] = useState<CommentSortType>('chronological');
  const [commentsCount, setCommentsCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching comments for post:', postId);
      const data = await commentsApi.fetchComments(postId, sortType);
      console.log('Fetched comments:', data);
      setComments(data);
      
      // Calculate total comments count (including replies)
      const totalCount = data.reduce((acc, comment) => {
        return acc + 1 + (comment.replies?.length || 0);
      }, 0);
      setCommentsCount(totalCount);
      console.log('Total comments count:', totalCount);
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

    console.log('Creating comment:', { content, parentCommentId, userId: user.id, postId });
    setIsSubmitting(true);
    try {
      const result = await commentsApi.createComment(postId, content, parentCommentId, user.id);
      console.log('Comment creation result:', result);
      
      if (!result.error) {
        toast({
          title: "Comentário criado!",
          description: "Seu comentário foi publicado com sucesso.",
        });
        // Refresh comments to show the new one
        await fetchComments();
        return true;
      } else {
        console.error('Error creating comment:', result.error);
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comentário",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const updateComment = async (commentId: string, content: string) => {
    if (!user) return false;

    try {
      const result = await commentsApi.updateComment(commentId, content, user.id);
      if (!result.error) {
        await fetchComments();
        toast({
          title: "Comentário atualizado!",
          description: "Seu comentário foi editado com sucesso.",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar comentário",
        variant: "destructive",
      });
    }
    return false;
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const success = await commentsApi.deleteComment(commentId, user.id);
      if (success) {
        await fetchComments();
        toast({
          title: "Comentário excluído",
          description: "O comentário foi excluído com sucesso.",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir comentário",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir comentário",
        variant: "destructive",
      });
    }
    return false;
  };

  const toggleLike = async (commentId: string) => {
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
      if (success) {
        await fetchComments();
        return true;
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
    return false;
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, sortType]);

  return {
    comments,
    isLoading,
    isSubmitting,
    sortType,
    setSortType,
    commentsCount,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    refetch: fetchComments
  };
};
