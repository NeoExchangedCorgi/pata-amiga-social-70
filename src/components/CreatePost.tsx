
import React, { useState } from 'react';
import { ImageIcon, Video, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, convertFileToDataUrl } from '@/utils/fileUpload';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { profile } = useAuth();
  const { createPost, refetch } = usePosts();
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

    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para postar",
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
        
        const uploadResult = await uploadFile(selectedFile, profile.id);
        
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
      const { error } = await createPost(content, mediaUrl, mediaType || undefined);
      
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
        
        // Recarregar posts
        refetch();
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
    <Card className="border-pata-blue-light/20 dark:border-pata-blue-dark/20">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
              {profile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
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
            
            {previewUrl && (
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
                  onClick={removeMedia}
                  disabled={isSubmitting}
                >
                  ×
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  className="hidden"
                  id="image-upload"
                  disabled={isSubmitting}
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
                    asChild
                    disabled={isSubmitting}
                  >
                    <span>
                      <ImageIcon className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Foto</span>
                    </span>
                  </Button>
                </label>
                
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleMediaUpload(e, 'video')}
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
                      <span className="ml-2 hidden sm:inline">Vídeo</span>
                    </span>
                  </Button>
                </label>
              </div>
              
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
