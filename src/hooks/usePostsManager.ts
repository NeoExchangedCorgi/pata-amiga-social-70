
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { useHiddenPosts } from '@/hooks/useHiddenPosts';
import { usePostsData } from './usePostsData';
import { useReportedPostsData } from './useReportedPostsData';

export type SortType = 'likes' | 'recent' | 'reported';

export const usePostsManager = () => {
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [sortType, setSortType] = useState<SortType>('likes');
  const { user } = useAuth();
  const { toast } = useToast();
  const { isProfileHidden } = useHiddenProfiles();
  const { isPostHidden } = useHiddenPosts();
  const { posts: allPosts, isLoading, refetch, setPosts } = usePostsData();
  const { reportedPosts } = useReportedPostsData();

  // Filter and sort posts
  useEffect(() => {
    if (sortType === 'reported') {
      setFilteredPosts(reportedPosts);
      return;
    }

    let postsToFilter = allPosts;

    // Remove reported posts from main feed
    const reportedPostIds = new Set(reportedPosts.map((p: any) => p.id));
    postsToFilter = allPosts.filter((post: any) => !reportedPostIds.has(post.id));

    if (!user) {
      // For non-authenticated users, just apply sorting
      const sorted = [...postsToFilter].sort((a: any, b: any) => {
        if (sortType === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          const likesA = a.post_likes?.length || 0;
          const likesB = b.post_likes?.length || 0;
          
          if (likesA !== likesB) {
            return likesB - likesA;
          }
          
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
      setFilteredPosts(sorted);
      return;
    }

    // For authenticated users, filter hidden profiles and posts, then sort
    const filtered = postsToFilter
      .filter((post: any) => !isProfileHidden(post.author_id))
      .filter((post: any) => !isPostHidden(post.id))
      .sort((a: any, b: any) => {
        if (sortType === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          const likesA = a.post_likes?.length || 0;
          const likesB = b.post_likes?.length || 0;
          
          if (likesA !== likesB) {
            return likesB - likesA;
          }
          
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
    
    setFilteredPosts(filtered);
  }, [allPosts, reportedPosts, isProfileHidden, isPostHidden, user, sortType]);

  const createPost = async (content: string, mediaUrls?: string[], mediaType?: 'image' | 'video' | 'mixed') => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    setIsCreating(true);
    
    // TODO: Implementar criação de post com o novo banco
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de posts será implementada com o novo banco",
      className: "bg-blue-500 text-white border-blue-600",
    });
    
    setIsCreating(false);
    return { error: 'Funcionalidade não implementada ainda' };
  };

  const updatePost = async (postId: string, content: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para editar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    // TODO: Implementar atualização de post com o novo banco
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de posts será implementada com o novo banco",
      className: "bg-blue-500 text-white border-blue-600",
    });
    
    return { error: 'Funcionalidade não implementada ainda' };
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    // TODO: Implementar exclusão de post com o novo banco
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de posts será implementada com o novo banco",
      className: "bg-blue-500 text-white border-blue-600",
    });
    
    return true;
  };

  return {
    posts: filteredPosts,
    isLoading: isLoading || isCreating,
    sortType,
    setSortType,
    createPost,
    updatePost,
    deletePost,
    refetch,
  };
};
