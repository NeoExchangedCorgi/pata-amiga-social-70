
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string, parentId?: string) => void;
  placeholder?: string;
  parentId?: string;
  isReply?: boolean;
  onCancel?: () => void;
}

const CommentForm = ({ onSubmit, placeholder = "Escreva um comentário...", parentId, isReply = false, onCancel }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { profile, isAuthenticated } = useAuth();
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && isAuthenticated) {
      onSubmit(content.trim(), parentId);
      setContent('');
      if (onCancel) onCancel();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${isReply ? 'ml-12 mt-3' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white text-xs">
            {profile?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            maxLength={maxChars}
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${content.length > maxChars * 0.8 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {content.length}/{maxChars}
            </span>
            <div className="flex space-x-2">
              {isReply && onCancel && (
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                size="sm" 
                disabled={!content.trim() || content.length > maxChars}
              >
                {isReply ? 'Responder' : 'Comentar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
