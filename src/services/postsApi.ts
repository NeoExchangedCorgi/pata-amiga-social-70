
import { postsQuery } from './posts/postsQuery';
import { postsMutations } from './posts/postsMutations';
import { postsLikes } from './posts/postsLikes';

export type { Post, SortType } from '@/types/post';

export const postsApi = {
  ...postsQuery,
  ...postsMutations,
  ...postsLikes
};
