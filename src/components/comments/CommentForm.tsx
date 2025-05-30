
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInitials } from '@/utils/formatters';
import { Send } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  onSubmit: (content: string) => Promise<boolean>;
}

const CommentForm = ({ postId, onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !profile) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(content.trim());
      if (success) {
        setContent('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white text-xs">
            {getUserInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="Escreva um comentário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none border-border/50 focus:border-pata-blue-light"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || isSubmitting}
              className="bg-pata-blue-light hover:bg-pata-blue-dark"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Comentar
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
