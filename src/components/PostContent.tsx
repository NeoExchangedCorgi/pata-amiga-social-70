
import React from 'react';

interface PostContentProps {
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  postId: string;
  authorId: string;
  postActions: any;
}

const PostContent = ({ 
  content, 
  mediaUrl, 
  mediaType 
}: PostContentProps) => {
  return (
    <div className="space-y-3">
      <p className="text-foreground whitespace-pre-wrap break-words">
        {content}
      </p>
      
      {mediaUrl && (
        <div className="rounded-lg overflow-hidden">
          {mediaType === 'video' ? (
            <video 
              controls 
              className="w-full max-h-96 object-cover"
              preload="metadata"
            >
              <source src={mediaUrl} type="video/mp4" />
              Seu navegador não suporta vídeos.
            </video>
          ) : (
            <img 
              src={mediaUrl} 
              alt="Mídia do post" 
              className="w-full max-h-96 object-cover"
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostContent;
