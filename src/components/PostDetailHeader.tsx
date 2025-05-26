
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PostDetailHeader = () => {
  const handleBackClick = () => {
    window.location.href = '/';
  };

  return (
    <Button
      variant="ghost"
      className="mb-4"
      onClick={handleBackClick}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
};

export default PostDetailHeader;
