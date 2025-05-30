
import { supabase } from '@/integrations/supabase/client';
import type { Post, SortType } from '@/types/post';

export const postsQuery = {
  async fetchPosts(sortType: SortType = 'likes') {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!fk_posts_author_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        post_likes!fk_post_likes_post_id (
          user_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    // Sort based on the provided sort type
    const sortedData = (data || []).sort((a, b) => {
      if (sortType === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // Sort by likes count (descending) then by creation date (descending)
        const likesA = a.post_likes?.length || 0;
        const likesB = b.post_likes?.length || 0;
        
        if (likesA !== likesB) {
          return likesB - likesA; // More likes first
        }
        
        // If same number of likes, sort by date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sortedData as Post[];
  }
};
