
import React from 'react';

interface PostContentProps {
  content: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video';
  postId: string;
  authorId: string;
  postActions: any;
}

const PostContent = ({ 
  content, 
  mediaUrl,
  mediaUrls, 
  mediaType 
}: PostContentProps) => {
  // Priorizar media_urls, mas manter compatibilidade com media_url
  const urls = mediaUrls && mediaUrls.length > 0 ? mediaUrls : (mediaUrl ? [mediaUrl] : []);

  return (
    <div className="space-y-3">
      <p className="text-foreground whitespace-pre-wrap break-words">
        {content}
      </p>
      
      {urls.length > 0 && (
        <div className="rounded-lg overflow-hidden">
          {mediaType === 'video' ? (
            <video 
              controls 
              className="w-full max-h-96 object-cover"
              preload="metadata"
            >
              <source src={urls[0]} type="video/mp4" />
              Seu navegador não suporta vídeos.
            </video>
          ) : (
            <div className={`grid gap-2 ${
              urls.length === 1 ? 'grid-cols-1' :
              urls.length === 2 ? 'grid-cols-2' :
              urls.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {urls.map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={`Mídia do post ${index + 1}`} 
                  className={`w-full object-cover ${
                    urls.length === 1 ? 'max-h-96' :
                    urls.length === 4 && index >= 2 ? 'h-32' :
                    'h-48'
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostContent;
