
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { useReportedPosts } from '@/hooks/useReportedPosts';
import { useHiddenPosts } from '@/hooks/useHiddenPosts';
import { usePostsManager } from '@/hooks/usePostsManager';
import { useUserHistory } from '@/hooks/useUserHistory';

export const usePostActions = (postId: string, authorId: string) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = usePosts();
  const { updatePost } = usePostsManager();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported } = useReportedPosts();
  const { hidePost, unhidePost, isPostHidden } = useHiddenPosts();
  const { addToHistory } = useUserHistory();
  const { toast } = useToast();

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);
  const isReported = isPostReported(postId);
  const isHidden = isPostHidden(postId);

  const handleLike = async () => {
    if (!isOwnPost && isAuthenticated) {
      await toggleLike(postId);
      await addToHistory(postId, 'like');
      window.location.reload();
    }
  };

  const handleEdit = async (newContent: string) => {
    if (!isAuthenticated || !isOwnPost) return false;
    const result = await updatePost(postId, newContent);
    if (!result.error) {
      window.location.reload();
    }
    return !result.error;
  };

  const handleReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await reportPost(postId);
    if (success) {
      await addToHistory(postId, 'report');
      window.location.reload();
    }
    return success;
  };

  const handleRemoveReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await removeReport(postId);
    if (success) {
      window.location.reload();
    }
    return success;
  };

  const handleHidePost = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await hidePost(postId);
    if (success) {
      await addToHistory(postId, 'hide');
      window.location.reload();
    }
    return success;
  };

  const handleUnhidePost = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await unhidePost(postId);
    if (success) {
      window.location.reload();
    }
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
    await toggleSavePost(postId);
    await addToHistory(postId, 'save');
    window.location.reload();
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
