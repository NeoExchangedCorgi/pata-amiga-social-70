
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
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !isAuthenticated || !user || isLoading || isSubmitting) {
      console.log('Comment submission blocked:', { 
        hasContent: !!content.trim(), 
        isAuthenticated, 
        hasUser: !!user, 
        isLoading, 
        isSubmitting 
      });
      return;
    }

    console.log('CommentForm: Starting submission', { content: content.trim(), userId: user.id });
    setIsLoading(true);
    
    try {
      const success = await onSubmit(content.trim());
      console.log('CommentForm: Submission result', success);
      
      if (success) {
        setContent('');
        console.log('CommentForm: Comment submitted successfully, form cleared');
      } else {
        console.error('CommentForm: Comment submission failed');
      }
    } catch (error) {
      console.error('CommentForm: Error submitting comment:', error);
    } finally {
      setIsLoading(false);
      console.log('CommentForm: Loading state reset');
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
        disabled={isLoading || isSubmitting}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!content.trim() || isLoading || isSubmitting}
          size="sm"
        >
          {isLoading || isSubmitting ? 'Enviando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
