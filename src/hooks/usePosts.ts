
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    user_type: 'user' | 'admin';
  };
  post_likes?: Array<{
    user_id: string;
  }>;
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!fk_posts_author_id (
            id,
            username,
            full_name,
            avatar_url,
            user_type
          ),
          post_likes!fk_post_likes_post_id (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      return data as Post[];
    },
  });
};
