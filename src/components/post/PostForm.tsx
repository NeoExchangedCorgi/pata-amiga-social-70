
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, convertFileToDataUrl } from '@/utils/fileUpload';
import MediaPreview from './MediaPreview';
import MediaUploadButtons from './MediaUploadButtons';

interface PostFormProps {
  onPostCreate: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => Promise<{ error?: string }>;
  onSuccess: () => void;
  profileId: string;
}

const PostForm = ({ onPostCreate, onSuccess, profileId }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { toast } = useToast();

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      
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

      setSelectedFile(file);
      setMediaType(type);
      
      // Criar preview para exibição imediata
      try {
        const previewDataUrl = await convertFileToDataUrl(file);
        setPreviewUrl(previewDataUrl);
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
      let mediaUrl: string | undefined;
      
      // Se há um arquivo selecionado, fazer upload primeiro
      if (selectedFile) {
        setUploadProgress('Fazendo upload do arquivo...');
        console.log('Starting file upload process');
        
        const uploadResult = await uploadFile(selectedFile, profileId);
        
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
        
        mediaUrl = uploadResult.url;
        console.log('Upload successful, media URL:', mediaUrl);
        setUploadProgress('Criando post...');
      }
      
      console.log('Creating post with:', { content, mediaUrl, mediaType });
      const { error } = await onPostCreate(content, mediaUrl, mediaType || undefined);
      
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
        setSelectedFile(null);
        setPreviewUrl(null);
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

  const removeMedia = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
      
      {previewUrl && mediaType && (
        <MediaPreview
          previewUrl={previewUrl}
          mediaType={mediaType}
          onRemove={removeMedia}
          isSubmitting={isSubmitting}
        />
      )}
      
      <div className="flex items-center justify-between">
        <MediaUploadButtons
          onImageUpload={(e) => handleMediaUpload(e, 'image')}
          onVideoUpload={(e) => handleMediaUpload(e, 'video')}
          isSubmitting={isSubmitting}
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
