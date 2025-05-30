
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';

interface MediaPreviewProps {
  previewUrls: string[];
  mediaType: 'image' | 'video';
  onRemove: (index: number) => void;
  onRemoveAll: () => void;
  isSubmitting: boolean;
}

const MediaPreview = ({ previewUrls, mediaType, onRemove, onRemoveAll, isSubmitting }: MediaPreviewProps) => {
  if (mediaType === 'video') {
    return (
      <div className="relative">
        <video 
          src={previewUrls[0]} 
          controls
          className="w-full h-48 object-cover rounded-lg"
        />
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => onRemove(0)}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {previewUrls.length > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {previewUrls.length} imagem{previewUrls.length > 1 ? 's' : ''} selecionada{previewUrls.length > 1 ? 's' : ''}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveAll}
            disabled={isSubmitting}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remover todas
          </Button>
        </div>
      )}
      
      <div className={`grid gap-2 ${
        previewUrls.length === 1 ? 'grid-cols-1' :
        previewUrls.length === 2 ? 'grid-cols-2' :
        previewUrls.length === 3 ? 'grid-cols-3' :
        'grid-cols-2'
      }`}>
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            <img 
              src={url} 
              alt={`Preview ${index + 1}`} 
              className={`w-full object-cover rounded-lg ${
                previewUrls.length === 4 && index >= 2 ? 'h-24' : 'h-32'
              }`}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={() => onRemove(index)}
              disabled={isSubmitting}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;
