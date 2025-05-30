
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, convertFileToDataUrl } from '@/utils/fileUpload';
import MediaPreview from './MediaPreview';
import MediaUploadButtons from './MediaUploadButtons';

interface PostFormProps {
  onPostCreate: (content: string, mediaUrls?: string[], mediaType?: 'image' | 'video') => Promise<{ error?: string }>;
  onSuccess: () => void;
  profileId: string;
}

const PostForm = ({ onPostCreate, onSuccess, profileId }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { toast } = useToast();

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    if (type === 'video') {
      if (files.length > 1) {
        toast({
          title: "Erro",
          description: "Você pode anexar apenas um vídeo por post",
          variant: "destructive",
        });
        return;
      }
      
      // Limpar qualquer mídia anterior ao selecionar vídeo
      setSelectedFiles([]);
      setPreviewUrls([]);
    } else {
      // Para imagens, verificar se já há um vídeo
      if (mediaType === 'video') {
        toast({
          title: "Erro",
          description: "Você não pode adicionar imagens quando já há um vídeo anexado",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar limite de 4 imagens
      if (selectedFiles.length + files.length > 4) {
        toast({
          title: "Limite excedido",
          description: "Você pode anexar no máximo 4 imagens por post",
          variant: "destructive",
        });
        return;
      }
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
        
        if (type === 'video') {
          setSelectedFiles([file]);
          setPreviewUrls([previewDataUrl]);
          setMediaType('video');
        } else {
          setSelectedFiles(prev => [...prev, file]);
          setPreviewUrls(prev => [...prev, previewDataUrl]);
          setMediaType('image');
        }
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
      
      // Se há arquivos selecionados, fazer upload
      if (selectedFiles.length > 0) {
        setUploadProgress(`Fazendo upload de ${selectedFiles.length} arquivo(s)...`);
        console.log('Starting file upload process for', selectedFiles.length, 'files');
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Fazendo upload do arquivo ${i + 1}/${selectedFiles.length}...`);
          
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
        
        console.log('Upload successful, media URLs:', mediaUrls);
        setUploadProgress('Criando post...');
      }
      
      console.log('Creating post with:', { content, mediaUrls, mediaType });
      const { error } = await onPostCreate(content, mediaUrls.length > 0 ? mediaUrls : undefined, mediaType || undefined);
      
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
        setSelectedFiles([]);
        setPreviewUrls([]);
        setMediaType(null);
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

  const removeMedia = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (selectedFiles.length === 1) {
      setMediaType(null);
    }
  };

  const removeAllMedia = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setMediaType(null);
    setUploadProgress('');
  };

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
      
      {previewUrls.length > 0 && mediaType && (
        <MediaPreview
          previewUrls={previewUrls}
          mediaType={mediaType}
          onRemove={removeMedia}
          onRemoveAll={removeAllMedia}
          isSubmitting={isSubmitting}
        />
      )}
      
      <div className="flex items-center justify-between">
        <MediaUploadButtons
          onImageUpload={(e) => handleMediaUpload(e, 'image')}
          onVideoUpload={(e) => handleMediaUpload(e, 'video')}
          isSubmitting={isSubmitting}
          hasVideo={mediaType === 'video'}
          imageCount={mediaType === 'image' ? selectedFiles.length : 0}
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
