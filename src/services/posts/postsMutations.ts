
import { supabase } from '@/integrations/supabase/client';

export const postsMutations = {
  async createPost(content: string, mediaUrls?: string[], mediaType?: 'image' | 'video' | 'mixed', userId?: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        media_urls: mediaUrls,
        media_type: mediaType as any,
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
  }
};
