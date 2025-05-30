
export interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_urls?: string[];
  media_type?: 'image' | 'video' | 'mixed';
  created_at: string;
  author_id: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  post_likes: Array<{ user_id: string }>;
  comments_count?: number;
}

export type SortType = 'likes' | 'recent';
