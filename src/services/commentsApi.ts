
import { supabase } from '@/integrations/supabase/client';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  author_id: string;
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const commentsApi = {
  async fetchComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!fk_comments_author_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data || [];
  },

  async createComment(postId: string, content: string, authorId: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        author_id: authorId,
      })
      .select(`
        *,
        author:profiles!fk_comments_author_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return { error: error.message };
    }

    return { data };
  },
};
