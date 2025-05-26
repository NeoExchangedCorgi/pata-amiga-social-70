
import React, { useState } from 'react';
import { MoreHorizontal, Flag, Bookmark, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostDropdownMenuProps {
  isAuthenticated: boolean;
  isOwnPost: boolean;
  isSaved: boolean;
  isProfileHidden: boolean;
  onSave: () => void;
  onHideProfile: () => void;
  onReport: () => void;
  onDelete: () => void;
}

const PostDropdownMenu = ({
  isAuthenticated,
  isOwnPost,
  isSaved,
  isProfileHidden,
  onSave,
  onHideProfile,
  onReport,
  onDelete
}: PostDropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isAuthenticated && (
          <>
            <DropdownMenuItem onClick={() => handleItemClick(onSave)}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Remover dos salvos' : 'Salvar post'}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleItemClick(onHideProfile)}>
              <EyeOff className="h-4 w-4 mr-2" />
              {isProfileHidden ? 'Perfil já ocultado' : 'Ocultar perfil'}
            </DropdownMenuItem>
            
            {!isOwnPost && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleItemClick(onReport)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Denunciar post
                </DropdownMenuItem>
              </>
            )}
            
            {isOwnPost && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleItemClick(onDelete)}
                  className="text-red-600 focus:text-red-600"
                >
                  Excluir post
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdownMenu;
