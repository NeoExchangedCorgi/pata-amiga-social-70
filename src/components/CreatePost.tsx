
import React, { useState } from 'react';
import { ImageIcon, Video, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      // Aqui seria a lógica para criar o post
      console.log('Criando post:', { content, image: selectedImage });
      setContent('');
      setSelectedImage(null);
    }
  };

  return (
    <Card className="border-pata-blue-light/20 dark:border-pata-blue-dark/20">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
              U
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Relate um caso de animal em situação crítica..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-pata-blue-light/20 dark:border-pata-blue-dark/20 focus:border-pata-blue-light dark:focus:border-pata-blue-dark"
            />
            
            {selectedImage && (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
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
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
                    asChild
                  >
                    <span>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Foto
                    </span>
                  </Button>
                </label>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-blue-light/10 dark:hover:bg-pata-blue-dark/10"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Vídeo
                </Button>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="bg-pata-yellow-light hover:bg-pata-yellow-light/90 dark:bg-pata-yellow-dark dark:hover:bg-pata-yellow-dark/90 text-black"
              >
                <Send className="h-4 w-4 mr-2" />
                Postar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
