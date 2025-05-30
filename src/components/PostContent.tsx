
import React from 'react';

interface PostContentProps {
  content: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | 'mixed';
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

  // Separar URLs por tipo de mídia quando é conteúdo misto
  const getMediaByType = () => {
    if (mediaType === 'mixed' && urls.length > 0) {
      // Assumir que vídeos têm extensões .mp4, .mov, .avi, .webm
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];
      
      urls.forEach(url => {
        const isVideo = videoExtensions.some(ext => 
          url.toLowerCase().includes(ext.toLowerCase())
        );
        
        if (isVideo) {
          videoUrls.push(url);
        } else {
          imageUrls.push(url);
        }
      });
      
      return { imageUrls, videoUrls };
    }
    
    return { 
      imageUrls: mediaType === 'image' ? urls : [], 
      videoUrls: mediaType === 'video' ? urls : [] 
    };
  };

  const { imageUrls, videoUrls } = getMediaByType();

  return (
    <div className="space-y-3">
      <p className="text-foreground whitespace-pre-wrap break-words">
        {content}
      </p>
      
      {(imageUrls.length > 0 || videoUrls.length > 0) && (
        <div className="space-y-3">
          {/* Renderizar imagens */}
          {imageUrls.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              <div className={`grid gap-2 ${
                imageUrls.length === 1 ? 'grid-cols-1' :
                imageUrls.length === 2 ? 'grid-cols-2' :
                imageUrls.length === 3 ? 'grid-cols-3' :
                'grid-cols-2'
              }`}>
                {imageUrls.map((url, index) => (
                  <img 
                    key={`image-${index}`}
                    src={url} 
                    alt={`Imagem do post ${index + 1}`} 
                    className={`w-full object-cover ${
                      imageUrls.length === 1 ? 'max-h-96' :
                      imageUrls.length === 4 && index >= 2 ? 'h-32' :
                      'h-48'
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Renderizar vídeos */}
          {videoUrls.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              {videoUrls.map((url, index) => (
                <video 
                  key={`video-${index}`}
                  controls 
                  className="w-full max-h-96 object-cover"
                  preload="metadata"
                >
                  <source src={url} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostContent;
