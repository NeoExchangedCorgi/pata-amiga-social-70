
import type { Post, SortType } from '@/types/post';
import { postsQuery } from './posts/postsQuery';
import { postsMutations } from './posts/postsMutations';
import { postsLikes } from './posts/postsLikes';

// Re-export types for backward compatibility
export type { Post, SortType };

// Unified API object
export const postsApi = {
  // Query operations
  fetchPosts: postsQuery.fetchPosts,
  
  // Mutation operations
  createPost: postsMutations.createPost,
  updatePost: postsMutations.updatePost,
  deletePost: postsMutations.deletePost,
  
  // Like operations
  checkUserLike: postsLikes.checkUserLike,
  addLike: postsLikes.addLike,
  removeLike: postsLikes.removeLike,
};
