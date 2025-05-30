
import { usePostsManager } from './usePostsManager';

// Re-export do tipo Post do postsApi
export type { Post } from '@/services/postsApi';

// Hook compatível com a interface anterior
export const usePosts = () => {
  const { posts, isLoading, deletePost, refetch } = usePostsManager();
  
  return {
    posts,
    isLoading,
    deletePost,
    refetch,
  };
};
