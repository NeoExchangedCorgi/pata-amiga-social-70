import React, { useState } from 'react';
import { MoreHorizontal, Flag, Bookmark, EyeOff, Trash2, FlagOff, Edit, Eye } from 'lucide-react';
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
import { useAdminPrivileges } from '@/hooks/useAdminPrivileges';

interface PostDropdownMenuProps {
  isAuthenticated: boolean;
  isOwnPost: boolean;
  isSaved: boolean;
  isProfileHidden: boolean;
  isReported: boolean;
  isPostHidden?: boolean;
  onSave: (e: React.MouseEvent) => void;
  onHideProfile: (e: React.MouseEvent) => void;
  onHidePost?: (e: React.MouseEvent) => void;
  onUnhidePost?: (e: React.MouseEvent) => void;
  onReport: (e: React.MouseEvent) => void;
  onRemoveReport: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onAdminDelete?: (e: React.MouseEvent) => void;
}

const PostDropdownMenu = ({
  isAuthenticated,
  isOwnPost,
  isSaved,
  isProfileHidden,
  isReported,
  isPostHidden = false,
  onSave,
  onHideProfile,
  onHidePost,
  onUnhidePost,
  onReport,
  onRemoveReport,
  onDelete,
  onEdit,
  onAdminDelete
}: PostDropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showAdminDeleteDialog, setShowAdminDeleteDialog] = useState(false);
  const { isAdmin, canDeleteAnyPost } = useAdminPrivileges();

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(e);
    setIsOpen(false);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReported) {
      handleItemClick(onRemoveReport, e);
    } else {
      setShowReportDialog(true);
      setIsOpen(false);
    }
  };

  const handleHidePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPostHidden && onUnhidePost) {
      handleItemClick(onUnhidePost, e);
    } else if (!isPostHidden && onHidePost) {
      handleItemClick(onHidePost, e);
    }
  };

  const handleAdminDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAdminDeleteDialog(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e);
    setShowDeleteDialog(false);
  };

  const handleConfirmReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReport(e);
    setShowReportDialog(false);
  };

  const handleConfirmAdminDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAdminDelete) {
      onAdminDelete(e);
    }
    setShowAdminDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
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
                {isSaved ? 'Desmarcar post' : 'Marcar post'}
              </DropdownMenuItem>
              
              {/* Sempre mostrar a opção de ocultar/desocultar post para usuários autenticados */}
              <DropdownMenuItem 
                onClick={handleHidePostClick}
                onSelect={(e) => e.preventDefault()}
              >
                {isPostHidden ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Desocultar post
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {isOwnPost ? 'Ocultar meu post' : 'Ocultar post'}
                  </>
                )}
              </DropdownMenuItem>
              
              {/* Sempre mostrar a opção de ocultar perfil para usuários autenticados */}
              <DropdownMenuItem 
                onClick={(e) => handleItemClick(onHideProfile, e)}
                onSelect={(e) => e.preventDefault()}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {isOwnPost ? 'Ocultar meu perfil' : 'Ocultar perfil'}
              </DropdownMenuItem>
              
              {isOwnPost ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleEditClick}
                    onSelect={(e) => e.preventDefault()}
                    className="text-blue-600 focus:text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar post
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDeleteClick}
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir post
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleReportClick}
                    onSelect={(e) => e.preventDefault()}
                    className={isReported ? "text-orange-600 focus:text-orange-600" : "text-red-600 focus:text-red-600"}
                  >
                    {isReported ? (
                      <>
                        <FlagOff className="h-4 w-4 mr-2" />
                        Retirar denúncia
                      </>
                    ) : (
                      <>
                        <Flag className="h-4 w-4 mr-2" />
                        Denunciar post
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}

              {/* Admin delete option for any post */}
              {canDeleteAnyPost && !isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleAdminDeleteClick}
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir (Admin)
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

      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Denunciar post</AlertDialogTitle>
            <AlertDialogDescription>
              Ao denunciar este post, ele será movido para a seção "Denunciados" onde ficará visível publicamente. 
              Esta ação pode ser desfeita posteriormente através do menu "Retirar denúncia".
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
              onClick={handleConfirmReport} 
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar denúncia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAdminDeleteDialog} onOpenChange={setShowAdminDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post (Administrador)</AlertDialogTitle>
            <AlertDialogDescription>
              Como administrador, você está prestes a excluir permanentemente este post. 
              Esta ação não pode ser desfeita e o post será removido completamente do sistema.
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
              onClick={handleConfirmAdminDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostDropdownMenu;
