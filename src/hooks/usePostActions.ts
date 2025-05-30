
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import { useHiddenPosts } from '@/hooks/useHiddenPosts';
import { usePostsManager } from '@/hooks/usePostsManager';
import { useUserHistory } from '@/hooks/useUserHistory';

export const usePostActions = (postId: string, authorId: string) => {
  const { user, isAuthenticated } = useAuth();
  const { updatePost } = usePostsManager();
  const { toggleLike, isPostLiked } = useLikedPosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported } = usePostReports();
  const { hidePost, unhidePost, isPostHidden } = useHiddenPosts();
  const { addToHistory } = useUserHistory();
  const { toast } = useToast();

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);
  const isReported = isPostReported(postId);
  const isHidden = isPostHidden(postId);
  const isLiked = isPostLiked(postId);

  const handleLike = async () => {
    if (!isOwnPost && isAuthenticated) {
      const result = await toggleLike(postId);
      await addToHistory(postId, 'like');
      return result;
    }
  };

  const handleEdit = async (newContent: string) => {
    if (!isAuthenticated || !isOwnPost) return false;
    const result = await updatePost(postId, newContent);
    return !result.error;
  };

  const handleReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await reportPost(postId);
    if (success) {
      await addToHistory(postId, 'report');
    }
    return success;
  };

  const handleRemoveReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await removeReport(postId);
    return success;
  };

  const handleHidePost = async () => {
    if (!isAuthenticated) return false;
    const success = await hidePost(postId);
    if (success) {
      await addToHistory(postId, 'hide');
    }
    return success;
  };

  const handleUnhidePost = async () => {
    if (!isAuthenticated) return false;
    const success = await unhidePost(postId);
    return success;
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para marcar posts",
        variant: "destructive",
      });
      return;
    }
    const result = await toggleSavePost(postId);
    await addToHistory(postId, 'save');
    return result;
  };

  const handleView = async () => {
    await addPostView(postId);
    await addToHistory(postId, 'view');
  };

  return {
    isOwnPost,
    isSaved,
    isReported,
    isHidden,
    isLiked,
    isAuthenticated,
    handleLike,
    handleEdit,
    handleReport,
    handleRemoveReport,
    handleHidePost,
    handleUnhidePost,
    handleSave,
    handleView,
  };
};
