
import React from 'react';
import { ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploadButtonsProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  hasVideo?: boolean;
  imageCount?: number;
}

const MediaUploadButtons = ({ 
  onImageUpload, 
  onVideoUpload, 
  isSubmitting, 
  hasVideo = false, 
  imageCount = 0 
}: MediaUploadButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
        id="image-upload"
        disabled={isSubmitting || imageCount >= 4}
        multiple
      />
      <label htmlFor="image-upload">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
          asChild
          disabled={isSubmitting || imageCount >= 4}
        >
          <span>
            <ImageIcon className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">
              Foto{imageCount > 0 ? ` (${imageCount}/4)` : 's'}
            </span>
          </span>
        </Button>
      </label>
      
      <input
        type="file"
        accept="video/*"
        onChange={onVideoUpload}
        className="hidden"
        id="video-upload"
        disabled={isSubmitting}
      />
      <label htmlFor="video-upload">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
          asChild
          disabled={isSubmitting}
        >
          <span>
            <Video className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">
              Vídeo{hasVideo ? ' (1/1)' : ''}
            </span>
          </span>
        </Button>
      </label>
    </div>
  );
};

export default MediaUploadButtons;
