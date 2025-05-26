
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';

export const usePostActions = (postId: string, authorId: string) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported } = usePostReports();
  const { toast } = useToast();

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);
  const isReported = isPostReported(postId);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(postId);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated || isOwnPost) return;
    await reportPost(postId);
  };

  const handleRemoveReport = async () => {
    if (!isAuthenticated || isOwnPost) return;
    await removeReport(postId);
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
    isReported,
    isAuthenticated,
    handleLike,
    handleReport,
    handleRemoveReport,
    handleSave,
    handleView,
  };
};
