
import { supabase } from '@/integrations/supabase/client';

export const postManagement = {
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
    // Check if user is admin or post owner
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    const isAdmin = currentUser?.user_type === 'admin';

    if (!isAdmin) {
      // Regular user - check ownership
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
    }

    console.log('Post found, proceeding with deletion...');

    // Admin can delete any post, regular user can only delete their own
    const deleteQuery = supabase.from('posts').delete().eq('id', postId);
    
    if (!isAdmin) {
      deleteQuery.eq('author_id', userId);
    }

    const { error } = await deleteQuery;

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    console.log('Post deleted successfully!');
    return true;
  },
};
