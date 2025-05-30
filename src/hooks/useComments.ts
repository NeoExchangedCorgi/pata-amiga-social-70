
import { useState, useEffect } from 'react';
import { commentsApi, type Comment } from '@/services/commentsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const data = await commentsApi.fetchComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar comentários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (content: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await commentsApi.createComment(postId, content, user.id);
      if (!result.error && result.data) {
        await fetchComments(); // Refresh comments
        toast({
          title: "Comentário publicado!",
          description: "Seu comentário foi adicionado com sucesso.",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao publicar comentário",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    isLoading,
    createComment,
    refetch: fetchComments,
  };
};
