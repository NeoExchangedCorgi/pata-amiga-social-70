
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import { useGlobalReports } from '@/hooks/useGlobalReports';
import { useHiddenPosts } from '@/hooks/useHiddenPosts';
import { usePostsManager } from '@/hooks/usePostsManager';

export const usePostActions = (postId: string, authorId: string) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = usePosts();
  const { updatePost } = usePostsManager();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported, refreshReports } = usePostReports();
  const { addGlobalReport, removeGlobalReport, isPostGloballyReported, isPostCensored } = useGlobalReports();
  const { hidePost, unhidePost, isPostHidden } = useHiddenPosts();
  const { toast } = useToast();

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);
  const isReported = isPostReported(postId);
  const isGloballyReported = isPostGloballyReported(postId);
  const isCensored = isPostCensored(postId);
  const isHidden = isPostHidden(postId);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(postId);
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
      setTimeout(() => refreshReports(), 100);
    }
    return success;
  };

  const handleRemoveReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await removeReport(postId);
    if (success) {
      setTimeout(() => refreshReports(), 100);
    }
    return success;
  };

  const handleGlobalReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await addGlobalReport(postId);
  };

  const handleRemoveGlobalReport = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await removeGlobalReport(postId);
  };

  const handleHidePost = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await hidePost(postId);
  };

  const handleUnhidePost = async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await unhidePost(postId);
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
    isGloballyReported,
    isCensored,
    isHidden,
    isAuthenticated,
    handleLike,
    handleEdit,
    handleReport,
    handleRemoveReport,
    handleGlobalReport,
    handleRemoveGlobalReport,
    handleHidePost,
    handleUnhidePost,
    handleSave,
    handleView,
  };
};
