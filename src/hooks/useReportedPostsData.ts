
import { useState, useEffect } from 'react';

export const useReportedPostsData = () => {
  const [reportedPosts, setReportedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportedPosts = async () => {
    // TODO: Implementar busca de posts denunciados com o novo banco
    console.log('Fetching reported posts - to be implemented with new database');
    setReportedPosts([]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  return {
    reportedPosts,
    isLoading,
    refetch: fetchReportedPosts,
  };
};
