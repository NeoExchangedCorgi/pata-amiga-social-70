
import { supabase } from '@/integrations/supabase/client';

export const postsLikes = {
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
  }
};
