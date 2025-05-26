
import { useState } from 'react';
import { uploadFile } from '@/utils/fileUpload';
import { APP_CONFIG } from '@/constants/app';
import { validateFileType } from '@/utils/formatters';

interface UseFileUploadReturn {
  isUploading: boolean;
  uploadProgress: string;
  uploadFile: (file: File, userId: string) => Promise<{ url?: string; error?: string }>;
  validateFile: (file: File, type: 'image' | 'video') => { isValid: boolean; error?: string };
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const validateFile = (file: File, type: 'image' | 'video') => {
    // Verificar tamanho
    if (file.size > APP_CONFIG.MEDIA_UPLOAD.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${APP_CONFIG.MEDIA_UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Verificar tipo
    const allowedTypes = type === 'image' 
      ? [...APP_CONFIG.MEDIA_UPLOAD.ALLOWED_IMAGE_TYPES] // Converter readonly para array mutável
      : [...APP_CONFIG.MEDIA_UPLOAD.ALLOWED_VIDEO_TYPES]; // Converter readonly para array mutável

    if (!validateFileType(file, allowedTypes)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não suportado para ${type}`
      };
    }

    return { isValid: true };
  };

  const handleUpload = async (file: File, userId: string) => {
    setIsUploading(true);
    setUploadProgress('Iniciando upload...');

    try {
      setUploadProgress('Fazendo upload...');
      const result = await uploadFile(file, userId);
      
      if (result.error) {
        return { error: result.error };
      }

      setUploadProgress('Upload concluído!');
      return { url: result.url };
    } catch (error) {
      console.error('Upload error:', error);
      return { error: 'Erro durante o upload' };
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadFile: handleUpload,
    validateFile,
  };
};
