
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, convertFileToDataUrl } from '@/utils/fileUpload';
import MediaPreview from './MediaPreview';
import MediaUploadButtons from './MediaUploadButtons';

interface PostFormProps {
  onPostCreate: (content: string, mediaUrls?: string[], mediaType?: 'image' | 'video' | 'mixed') => Promise<{ error?: string }>;
  onSuccess: () => void;
  profileId: string;
}

const PostForm = ({ onPostCreate, onSuccess, profileId }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Verificar limite de 4 imagens
    if (selectedImageFiles.length + files.length > 4) {
      toast({
        title: "Limite excedido",
        description: "Você pode anexar no máximo 4 imagens por post",
        variant: "destructive",
      });
      return;
    }

    for (const file of files) {
      // Verificar tamanho do arquivo (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 50MB",
          variant: "destructive",
        });
        continue;
      }

      try {
        const previewDataUrl = await convertFileToDataUrl(file);
        setSelectedImageFiles(prev => [...prev, file]);
        setImagePreviewUrls(prev => [...prev, previewDataUrl]);
      } catch (error) {
        console.error('Error creating preview:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar preview do arquivo",
          variant: "destructive",
        });
      }
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > 1) {
      toast({
        title: "Erro",
        description: "Você pode anexar apenas um vídeo por post",
        variant: "destructive",
      });
      return;
    }

    // Se já há um vídeo, substituir
    if (selectedVideoFile) {
      toast({
        title: "Vídeo substituído",
        description: "O vídeo anterior foi substituído pelo novo",
      });
    }

    const file = files[0];
    
    // Verificar tamanho do arquivo (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 50MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const previewDataUrl = await convertFileToDataUrl(file);
      setSelectedVideoFile(file);
      setVideoPreviewUrl(previewDataUrl);
    } catch (error) {
      console.error('Error creating preview:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar preview do arquivo",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo do post não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress('Iniciando...');
    
    try {
      let mediaUrls: string[] = [];
      let mediaType: 'image' | 'video' | 'mixed' | undefined = undefined;
      
      // Calcular total de arquivos para upload
      const totalFiles = selectedImageFiles.length + (selectedVideoFile ? 1 : 0);
      
      if (totalFiles > 0) {
        setUploadProgress(`Fazendo upload de ${totalFiles} arquivo(s)...`);
        console.log('Starting file upload process for', totalFiles, 'files');
        
        let currentFile = 0;
        
        // Upload das imagens
        for (const file of selectedImageFiles) {
          currentFile++;
          setUploadProgress(`Fazendo upload do arquivo ${currentFile}/${totalFiles}...`);
          
          const uploadResult = await uploadFile(file, profileId);
          
          if (uploadResult.error) {
            console.error('Upload failed:', uploadResult.error);
            toast({
              title: "Erro no upload",
              description: uploadResult.error,
              variant: "destructive",
            });
            setIsSubmitting(false);
            setUploadProgress('');
            return;
          }
          
          mediaUrls.push(uploadResult.url!);
        }
        
        // Upload do vídeo
        if (selectedVideoFile) {
          currentFile++;
          setUploadProgress(`Fazendo upload do arquivo ${currentFile}/${totalFiles}...`);
          
          const uploadResult = await uploadFile(selectedVideoFile, profileId);
          
          if (uploadResult.error) {
            console.error('Upload failed:', uploadResult.error);
            toast({
              title: "Erro no upload",
              description: uploadResult.error,
              variant: "destructive",
            });
            setIsSubmitting(false);
            setUploadProgress('');
            return;
          }
          
          mediaUrls.push(uploadResult.url!);
        }
        
        // Determinar o tipo de mídia
        if (selectedImageFiles.length > 0 && selectedVideoFile) {
          mediaType = 'mixed';
        } else if (selectedImageFiles.length > 0) {
          mediaType = 'image';
        } else if (selectedVideoFile) {
          mediaType = 'video';
        }
        
        console.log('Upload successful, media URLs:', mediaUrls);
        setUploadProgress('Criando post...');
      }
      
      console.log('Creating post with:', { content, mediaUrls, mediaType });
      const { error } = await onPostCreate(content, mediaUrls.length > 0 ? mediaUrls : undefined, mediaType);
      
      if (error) {
        console.error('Post creation failed:', error);
        toast({
          title: "Erro ao criar post",
          description: error,
          variant: "destructive",
        });
      } else {
        console.log('Post created successfully');
        toast({
          title: "Post criado com sucesso!",
          description: "Seu post foi publicado no feed",
          className: "bg-green-500 text-white border-green-600",
        });
        
        // Limpar formulário
        setContent('');
        setSelectedImageFiles([]);
        setSelectedVideoFile(null);
        setImagePreviewUrls([]);
        setVideoPreviewUrl(null);
        setUploadProgress('');
        
        onSuccess();
      }
    } catch (error) {
      console.error('Error in post creation process:', error);
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
    setUploadProgress('');
  };

  const removeImage = (index: number) => {
    setSelectedImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setSelectedVideoFile(null);
    setVideoPreviewUrl(null);
    setUploadProgress('');
  };

  const removeAllMedia = () => {
    setSelectedImageFiles([]);
    setSelectedVideoFile(null);
    setImagePreviewUrls([]);
    setVideoPreviewUrl(null);
    setUploadProgress('');
  };

  const hasMedia = selectedImageFiles.length > 0 || selectedVideoFile !== null;

  return (
    <div className="flex-1 space-y-3">
      <Textarea
        placeholder="Relate um caso de animal em situação crítica..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none border-pata-blue-light/20 dark:border-pata-blue-dark/20 focus:border-pata-blue-light dark:focus:border-pata-blue-dark"
        disabled={isSubmitting}
      />
      
      {uploadProgress && (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          {uploadProgress}
        </div>
      )}
      
      {selectedImageFiles.length > 0 && (
        <MediaPreview
          previewUrls={imagePreviewUrls}
          mediaType="image"
          onRemove={removeImage}
          onRemoveAll={() => {
            setSelectedImageFiles([]);
            setImagePreviewUrls([]);
          }}
          isSubmitting={isSubmitting}
        />
      )}
      
      {selectedVideoFile && videoPreviewUrl && (
        <MediaPreview
          previewUrls={[videoPreviewUrl]}
          mediaType="video"
          onRemove={removeVideo}
          onRemoveAll={removeVideo}
          isSubmitting={isSubmitting}
        />
      )}
      
      <div className="flex items-center justify-between">
        <MediaUploadButtons
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          isSubmitting={isSubmitting}
          hasVideo={selectedVideoFile !== null}
          imageCount={selectedImageFiles.length}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="bg-pata-yellow-light hover:bg-pata-yellow-light/90 dark:bg-pata-yellow-dark dark:hover:bg-pata-yellow-dark/90 text-black"
        >
          <Send className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">
            {isSubmitting ? (uploadProgress || 'Postando...') : 'Postar'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PostForm;
