
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { useNavigate } from 'react-router-dom';

export const usePostActions = (postId: string, authorId: string) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(postId);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    
    // Copiar link do post para área de transferência
    const postUrl = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link copiado!",
      description: "O link do post foi copiado. Redirecionando para o chat...",
      className: "bg-green-500 text-white border-green-600",
    });
    
    // Redirecionar para a página de chat
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
    
    return true;
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para salvar posts",
        variant: "destructive",
      });
      return;
    }
    toggleSavePost(postId);
  };

  const handleView = () => {
    addPostView(postId);
  };

  return {
    isOwnPost,
    isSaved,
    isAuthenticated,
    handleLike,
    handleReport,
    handleSave,
    handleView,
  };
};
