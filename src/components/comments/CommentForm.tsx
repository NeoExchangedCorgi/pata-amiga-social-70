
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
}

const CommentForm = ({ onSubmit, placeholder = "Adicione um comentário...", isSubmitting = false, autoFocus = false }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isAuthenticated) return;

    const success = await onSubmit(content.trim());
    if (success) {
      setContent('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">
          Faça login para comentar
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!content.trim() || isSubmitting}
          size="sm"
        >
          {isSubmitting ? 'Enviando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
