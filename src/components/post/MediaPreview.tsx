
import React from 'react';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  previewUrl: string;
  mediaType: 'image' | 'video';
  onRemove: () => void;
  isSubmitting: boolean;
}

const MediaPreview = ({ previewUrl, mediaType, onRemove, isSubmitting }: MediaPreviewProps) => {
  return (
    <div className="relative">
      {mediaType === 'image' ? (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <video 
          src={previewUrl} 
          controls
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
        disabled={isSubmitting}
      >
        ×
      </Button>
    </div>
  );
};

export default MediaPreview;
