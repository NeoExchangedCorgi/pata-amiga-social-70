
import { postsService } from './posts/postsService';
import { postManagement } from './posts/postManagement';
import { postInteractions } from './posts/postInteractions';

// Re-export types and functions for backward compatibility
export type { Post, SortType } from './posts/types';

export const postsApi = {
  // Posts service methods
  fetchPosts: postsService.fetchPosts,
  createPost: postsService.createPost,
  
  // Post management methods
  updatePost: postManagement.updatePost,
  deletePost: postManagement.deletePost,
  
  // Post interaction methods
  checkUserLike: postInteractions.checkUserLike,
  addLike: postInteractions.addLike,
  removeLike: postInteractions.removeLike,
};
