
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/services/postsApi';

interface ReportedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  posts: Post;
}

export const useReportedPostsData = () => {
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('post_reports')
        .select(`
          *,
          posts!fk_post_reports_post_id (
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
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reported posts:', error);
        return;
      }

      // Get unique posts from reports
      const uniquePosts = data?.reduce((acc, report: ReportedPost) => {
        if (report.posts && !acc.find(p => p.id === report.posts.id)) {
          acc.push(report.posts);
        }
        return acc;
      }, [] as Post[]) || [];

      setReportedPosts(uniquePosts);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedPosts();

    const channel = supabase
      .channel('reported-posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_reports' }, () => {
        fetchReportedPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    reportedPosts,
    isLoading,
    refetch: fetchReportedPosts,
  };
};
