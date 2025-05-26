
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostDetailHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
    window.location.reload();
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
