
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  content: string;
  media_url?: string;
  media_urls?: string[];
  media_type?: 'image' | 'video';
  created_at: string;
  author_id: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  post_likes: Array<{ user_id: string }>;
}

export type SortType = 'likes' | 'recent';

export const postsApi = {
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
  },

  async createPost(content: string, mediaUrls?: string[], mediaType?: 'image' | 'video', userId?: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        media_urls: mediaUrls,
        media_type: mediaType,
        author_id: userId,
      })
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
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { error: error.message };
    }

    return { data };
  },

  async updatePost(postId: string, content: string, userId: string) {
    const { data: existingPost, error: checkError } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', postId)
      .eq('author_id', userId)
      .single();

    if (checkError || !existingPost) {
      console.error('Post not found or not owned by user:', checkError);
      return { error: 'Post não encontrado ou você não tem permissão para editá-lo' };
    }

    const { data, error } = await supabase
      .from('posts')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('author_id', userId)
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
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return { error: error.message };
    }

    return { data };
  },

  async deletePost(postId: string, userId: string) {
    const { data: existingPost, error: checkError } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', postId)
      .eq('author_id', userId)
      .single();

    if (checkError || !existingPost) {
      console.error('Post not found or not owned by user:', checkError);
      return false;
    }

    console.log('Post found, proceeding with deletion...');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', userId);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    console.log('Post deleted successfully!');
    return true;
  },

  async checkUserLike(postId: string, userId: string) {
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    return !!data;
  },

  async addLike(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId,
      });

    if (error) {
      console.error('Error adding like:', error);
      return false;
    }
    return true;
  },

  async removeLike(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing like:', error);
      return false;
    }
    return true;
  },
};
