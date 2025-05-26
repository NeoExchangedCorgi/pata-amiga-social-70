
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, convertFileToDataUrl } from '@/utils/fileUpload';
import { APP_CONFIG } from '@/constants/app';
import { validateFileType, formatFileSize } from '@/utils/formatters';

interface FileUploadState {
  isUploading: boolean;
  previewUrl: string | null;
  mediaType: 'image' | 'video' | null;
  uploadedUrl: string | null;
}

export const useFileUpload = (userId: string) => {
  const { toast } = useToast();
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    previewUrl: null,
    mediaType: null,
    uploadedUrl: null,
  });

  const validateFile = (file: File, type: 'image' | 'video'): boolean => {
    const allowedTypes = type === 'image' 
      ? APP_CONFIG.MEDIA_UPLOAD.ALLOWED_IMAGE_TYPES 
      : APP_CONFIG.MEDIA_UPLOAD.ALLOWED_VIDEO_TYPES;

    if (!validateFileType(file, allowedTypes)) {
      toast({
        title: "Arquivo inválido",
        description: `Apenas arquivos de ${type} são permitidos.`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > APP_CONFIG.MEDIA_UPLOAD.MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${formatFileSize(APP_CONFIG.MEDIA_UPLOAD.MAX_FILE_SIZE)}.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    if (!validateFile(file, type)) return;

    setUploadState(prev => ({ ...prev, isUploading: true }));

    try {
      const previewUrl = await convertFileToDataUrl(file);
      setUploadState(prev => ({
        ...prev,
        previewUrl,
        mediaType: type,
      }));

      const { url, error } = await uploadFile(file, userId);
      
      if (error) {
        toast({
          title: "Erro no upload",
          description: error,
          variant: "destructive",
        });
        resetUpload();
        return;
      }

      setUploadState(prev => ({
        ...prev,
        uploadedUrl: url,
        isUploading: false,
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: "Erro inesperado ao fazer upload do arquivo.",
        variant: "destructive",
      });
      resetUpload();
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      previewUrl: null,
      mediaType: null,
      uploadedUrl: null,
    });
  };

  return {
    ...uploadState,
    handleFileUpload,
    resetUpload,
  };
};
