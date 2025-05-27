
import { useCallback } from 'react';
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

  const handleLike = useCallback(async () => {
    if (!isOwnPost && isAuthenticated) {
      await toggleLike(postId);
      return true;
    }
    return false;
  }, [isOwnPost, isAuthenticated, toggleLike, postId]);

  const handleEdit = useCallback(async (newContent: string) => {
    if (!isAuthenticated || !isOwnPost) return false;
    const result = await updatePost(postId, newContent);
    return !result.error;
  }, [isAuthenticated, isOwnPost, updatePost, postId]);

  const handleReport = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await reportPost(postId);
    if (success) {
      setTimeout(() => refreshReports(), 100);
    }
    return success;
  }, [isAuthenticated, isOwnPost, reportPost, postId, refreshReports]);

  const handleRemoveReport = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    const success = await removeReport(postId);
    if (success) {
      setTimeout(() => refreshReports(), 100);
    }
    return success;
  }, [isAuthenticated, isOwnPost, removeReport, postId, refreshReports]);

  const handleGlobalReport = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await addGlobalReport(postId);
  }, [isAuthenticated, isOwnPost, addGlobalReport, postId]);

  const handleRemoveGlobalReport = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await removeGlobalReport(postId);
  }, [isAuthenticated, isOwnPost, removeGlobalReport, postId]);

  const handleHidePost = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await hidePost(postId);
  }, [isAuthenticated, isOwnPost, hidePost, postId]);

  const handleUnhidePost = useCallback(async () => {
    if (!isAuthenticated || isOwnPost) return false;
    return await unhidePost(postId);
  }, [isAuthenticated, isOwnPost, unhidePost, postId]);

  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para marcar posts",
        variant: "destructive",
      });
      return false;
    }
    await toggleSavePost(postId);
    return true;
  }, [isAuthenticated, toggleSavePost, postId, toast]);

  const handleView = useCallback(async () => {
    if (isAuthenticated && !isOwnPost) {
      await addPostView(postId);
      return true;
    }
    return false;
  }, [isAuthenticated, isOwnPost, addPostView, postId]);

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
