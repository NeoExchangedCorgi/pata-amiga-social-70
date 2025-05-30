
import { supabase } from '@/integrations/supabase/client';
import type { Comment, CommentSortType } from '@/types/comment';

export const commentsApi = {
  async fetchComments(postId: string, sortType: CommentSortType = 'chronological') {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          comment_likes (
            user_id
          ),
          replies:comments!comments_parent_comment_id_fkey (
            *,
            profiles!comments_author_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            ),
            comment_likes (
              user_id
            )
          )
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null);

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      // Transform data to match Comment interface
      const transformedComments = (data || []).map(comment => ({
        ...comment,
        profiles: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles,
        comment_likes: comment.comment_likes || [],
        replies: Array.isArray(comment.replies) ? comment.replies.map((reply: any) => ({
          ...reply,
          profiles: Array.isArray(reply.profiles) ? reply.profiles[0] : reply.profiles,
          comment_likes: reply.comment_likes || []
        })).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [],
        replies_count: Array.isArray(comment.replies) ? comment.replies.length : 0
      })) as Comment[];

      // Sort comments based on type
      if (sortType === 'popularity') {
        return transformedComments.sort((a, b) => {
          const likesA = a.comment_likes?.length || 0;
          const likesB = b.comment_likes?.length || 0;
          if (likesA !== likesB) {
            return likesB - likesA;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      } else {
        return transformedComments.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async fetchReplies(commentId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          comment_likes (
            user_id
          )
        `)
        .eq('parent_comment_id', commentId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        return [];
      }

      return (data || []).map(reply => ({
        ...reply,
        profiles: Array.isArray(reply.profiles) ? reply.profiles[0] : reply.profiles,
        comment_likes: reply.comment_likes || []
      })) as Comment[];
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  },

  async createComment(postId: string, content: string, parentCommentId?: string, userId?: string) {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content,
          parent_comment_id: parentCommentId,
          author_id: userId
        })
        .select(`
          *,
          profiles!comments_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          comment_likes (
            user_id
          )
        `)
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return { error: error.message };
      }

      return { 
        data: {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
          comment_likes: data.comment_likes || []
        }
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { error: 'Internal server error' };
    }
  },

  async updateComment(commentId: string, content: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .eq('author_id', userId)
        .select(`
          *,
          profiles!comments_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          comment_likes (
            user_id
          )
        `)
        .single();

      if (error) {
        console.error('Error updating comment:', error);
        return { error: error.message };
      }

      return { 
        data: {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
          comment_likes: data.comment_likes || []
        }
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      return { error: 'Internal server error' };
    }
  },

  async deleteComment(commentId: string, userId: string) {
    try {
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
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },

  async toggleCommentLike(commentId: string, userId: string) {
    try {
      // Check if already liked
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
      } else {
        // Add like
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: userId
          });

        if (error) {
          console.error('Error adding comment like:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return false;
    }
  },

  async getCommentsCount(postId: string) {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('id', { count: 'exact' })
        .eq('post_id', postId);

      if (error) {
        console.error('Error fetching comments count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching comments count:', error);
      return 0;
    }
  }
};
