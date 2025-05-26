
import React, { useState } from 'react';
import { MoreHorizontal, Flag, Bookmark, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PostDropdownMenuProps {
  isAuthenticated: boolean;
  isOwnPost: boolean;
  isSaved: boolean;
  isProfileHidden: boolean;
  onSave: (e: React.MouseEvent) => void;
  onHideProfile: (e: React.MouseEvent) => void;
  onReport: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleItemClick = (action: (e: React.MouseEvent) => void, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    action(e);
    setIsOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isAuthenticated && (
            <>
              <DropdownMenuItem 
                onClick={(e) => handleItemClick(onSave, e)}
                onSelect={(e) => e.preventDefault()}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Remover dos salvos' : 'Salvar post'}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={(e) => handleItemClick(onHideProfile, e)}
                onSelect={(e) => e.preventDefault()}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {isProfileHidden ? 'Perfil já ocultado' : 'Ocultar perfil'}
              </DropdownMenuItem>
              
              {!isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => handleItemClick(onReport, e)}
                    onSelect={(e) => e.preventDefault()}
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
                    onClick={handleDeleteClick}
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir post
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostDropdownMenu;
