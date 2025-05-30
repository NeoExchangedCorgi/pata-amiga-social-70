
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder?: string;
  submitText?: string;
  onCancel?: () => void;
  initialValue?: string;
}

const CommentForm = ({ 
  onSubmit, 
  placeholder = "Escreva um comentário...",
  submitText = "Comentar",
  onCancel,
  initialValue = ""
}: CommentFormProps) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    const success = await onSubmit(content.trim());
    
    if (success) {
      setContent('');
      onCancel?.();
    }
    
    setIsSubmitting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Faça login para comentar</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : submitText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
