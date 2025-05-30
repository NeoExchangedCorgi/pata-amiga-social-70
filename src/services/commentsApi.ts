
import { supabase } from '@/integrations/supabase/client';
import type { Comment, CommentSortType } from '@/types/comment';

export const commentsApi = {
  async fetchComments(postId: string, sortType: CommentSortType = 'chronological') {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles!fk_comments_author_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        comment_likes!fk_comment_likes_comment_id (
          user_id
        )
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null);

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    // Sort comments based on type
    const sortedData = (data || []).sort((a, b) => {
      if (sortType === 'popularity') {
        const likesA = a.comment_likes?.length || 0;
        const likesB = b.comment_likes?.length || 0;
        
        if (likesA !== likesB) {
          return likesB - likesA; // More likes first
        }
        
        // If same number of likes, sort by date (newest first for popularity)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // Chronological order (oldest first)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      sortedData.map(async (comment) => {
        const replies = await this.fetchReplies(comment.id);
        return {
          ...comment,
          replies,
          replies_count: replies.length
        };
      })
    );

    return commentsWithReplies as Comment[];
  },

  async fetchReplies(parentCommentId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles!fk_comments_author_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        comment_likes!fk_comment_likes_comment_id (
          user_id
        )
      `)
      .eq('parent_comment_id', parentCommentId)
      .order('created_at', { ascending: true }); // Always chronological for replies

    if (error) {
      console.error('Error fetching replies:', error);
      return [];
    }

    return data as Comment[];
  },

  async createComment(postId: string, content: string, parentCommentId?: string, userId?: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        parent_comment_id: parentCommentId,
        author_id: userId,
      })
      .select(`
        *,
        profiles!fk_comments_author_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        comment_likes!fk_comment_likes_comment_id (
          user_id
        )
      `)
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return { error: error.message };
    }

    return { data };
  },

  async updateComment(commentId: string, content: string, userId: string) {
    const { data: existingComment, error: checkError } = await supabase
      .from('comments')
      .select('id, author_id')
      .eq('id', commentId)
      .eq('author_id', userId)
      .single();

    if (checkError || !existingComment) {
      console.error('Comment not found or not owned by user:', checkError);
      return { error: 'Comentário não encontrado ou você não tem permissão para editá-lo' };
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('author_id', userId)
      .select(`
        *,
        profiles!fk_comments_author_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        comment_likes!fk_comment_likes_comment_id (
          user_id
        )
      `)
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return { error: error.message };
    }

    return { data };
  },

  async deleteComment(commentId: string, userId: string) {
    const { data: existingComment, error: checkError } = await supabase
      .from('comments')
      .select('id, author_id')
      .eq('id', commentId)
      .eq('author_id', userId)
      .single();

    if (checkError || !existingComment) {
      console.error('Comment not found or not owned by user:', checkError);
      return false;
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', userId);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  },

  async toggleCommentLike(commentId: string, userId: string) {
    // Check if user already liked this comment
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing comment like:', error);
        return false;
      }
      return true;
    } else {
      // Add like
      const { error } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId,
        });

      if (error) {
        console.error('Error adding comment like:', error);
        return false;
      }
      return true;
    }
  },

  async getCommentsCount(postId: string) {
    // Count direct comments
    const { count: commentsCount, error: commentsError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .is('parent_comment_id', null);

    // Count all replies
    const { count: repliesCount, error: repliesError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .not('parent_comment_id', 'is', null);

    if (commentsError || repliesError) {
      console.error('Error counting comments:', commentsError || repliesError);
      return 0;
    }

    return (commentsCount || 0) + (repliesCount || 0);
  }
};
