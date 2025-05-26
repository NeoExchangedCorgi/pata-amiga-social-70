
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostActions } from '@/hooks/usePostActions';

interface PostContentProps {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  isReported: boolean;
  postId: string;
  authorId: string;
}

const PostContent = ({ content, mediaUrl, mediaType, isReported, postId, authorId }: PostContentProps) => {
  const [showBlurredContent, setShowBlurredContent] = useState(false);
  const { isCensored, handleGlobalReport, isGloballyReported } = usePostActions(postId, authorId);
  
  // Usar censura global como prioridade sobre denúncia pessoal
  const shouldBlur = (isCensored || isReported) && !showBlurredContent;
  const isCensoredGlobally = isCensored;

  // Reset showBlurredContent quando isReported ou isCensored muda
  useEffect(() => {
    if (!isReported && !isCensored) {
      setShowBlurredContent(false);
    }
  }, [isReported, isCensored]);

  const handleViewContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBlurredContent(true);
  };

  const handleReportContent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isGloballyReported) {
      await handleGlobalReport();
    }
  };

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
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <Button
            variant="outline"
            onClick={handleViewContent}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isCensoredGlobally 
              ? "Possível conteúdo sensível! Deseja visualizar mesmo assim?" 
              : "Possível conteúdo sensível! Clique para visualizar"
            }
          </Button>
          {isCensoredGlobally && !isGloballyReported && (
            <Button
              variant="outline"
              onClick={handleReportContent}
              className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
            >
              <Flag className="h-4 w-4 mr-2" />
              Ajude a denunciar!
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {(isReported || isCensored) && showBlurredContent && (
        <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              {isCensoredGlobally 
                ? "Conteúdo com denúncias da comunidade - visualizando mesmo assim"
                : "Conteúdo denunciado - visualizando mesmo assim"
              }
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
