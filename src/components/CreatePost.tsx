
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { usePostsManager } from '@/hooks/usePostsManager';
import { getUserInitials } from '@/utils/formatters';
import PostForm from './post/PostForm';

const CreatePost = () => {
  const { profile } = useAuth();
  const { createPost } = usePostsManager();

  if (!profile?.id) {
    return null;
  }

  const handlePostCreate = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    return await createPost(content, mediaUrl, mediaType);
  };

  const handleSuccess = () => {
    // Callback executado após criação bem-sucedida do post
    console.log('Post created successfully');
  };

  return (
    <Card className="border-pata-blue-light/20 dark:border-pata-blue-dark/20">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
              {getUserInitials(profile?.full_name || 'U')}
            </AvatarFallback>
          </Avatar>
          
          <PostForm
            onPostCreate={handlePostCreate}
            onSuccess={handleSuccess}
            profileId={profile.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
