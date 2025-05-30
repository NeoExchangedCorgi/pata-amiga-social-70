
export interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_urls?: string[];
  media_type?: 'image' | 'video' | 'mixed';
  created_at: string;
  updated_at: string;
  author_id: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    user_type: 'user' | 'admin';
  };
  post_likes: Array<{ user_id: string }>;
}

export type SortType = 'likes' | 'recent';
