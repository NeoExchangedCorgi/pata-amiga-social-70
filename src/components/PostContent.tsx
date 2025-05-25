
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostContentProps {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  isReported: boolean;
}

const PostContent = ({ content, mediaUrl, mediaType, isReported }: PostContentProps) => {
  const [showBlurredContent, setShowBlurredContent] = useState(false);
  const shouldBlur = isReported && !showBlurredContent;

  if (shouldBlur) {
    return (
      <div className="relative">
        <div className="filter blur-md select-none pointer-events-none">
          <p className="text-sm leading-relaxed mb-3">{content}</p>
          {mediaUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              {mediaType === 'video' ? (
                <video 
                  src={mediaUrl} 
                  controls
                  className="w-full h-auto max-h-96 object-cover"
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt="Post media" 
                  className="w-full h-auto max-h-96 object-cover"
                />
              )}
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowBlurredContent(true);
            }}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Possível conteúdo sensível! Clique para visualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isReported && showBlurredContent && (
        <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Conteúdo denunciado - visualizando mesmo assim
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowBlurredContent(false);
              }}
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      <p className="text-sm leading-relaxed mb-3">{content}</p>
      
      {mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {mediaType === 'video' ? (
            <video 
              src={mediaUrl} 
              controls
              className="w-full h-auto max-h-96 object-cover"
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt="Post media" 
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>
      )}
    </>
  );
};

export default PostContent;
