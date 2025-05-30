
export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_comment_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  comment_likes: Array<{ user_id: string }>;
  replies?: Comment[];
  replies_count?: number;
}

export type CommentSortType = 'chronological' | 'popularity';
