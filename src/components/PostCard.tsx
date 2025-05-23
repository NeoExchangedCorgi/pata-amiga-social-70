
import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostCardProps {
  post: {
    id: string;
    author: string;
    username: string;
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    replies: number;
    isLiked: boolean;
    isOwnPost?: boolean;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (!post.isOwnPost) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  return (
    <Card className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
                {post.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{post.author}</h3>
              <p className="text-xs text-muted-foreground">@{post.username} · {post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed mb-3">{post.content}</p>
        
        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-pata-blue-light dark:hover:text-pata-blue-dark"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.replies}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={post.isOwnPost}
            className={`flex items-center space-x-2 ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-red-500'
            } ${post.isOwnPost ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-orange-500"
          >
            <Flag className="h-4 w-4" />
            <span className="text-xs">Denunciar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
