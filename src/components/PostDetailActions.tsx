
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Flag, FlagOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface PostDetailActionsProps {
  isOwnPost: boolean;
  isReported: boolean;
  onDelete: () => void;
  onReport: () => void;
  onRemoveReport?: () => void;
}

const PostDetailActions = ({ 
  isOwnPost, 
  isReported, 
  onDelete, 
  onReport, 
  onRemoveReport 
}: PostDetailActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleReportClick = () => {
    if (isReported && onRemoveReport) {
      onRemoveReport();
    } else {
      setShowReportDialog(true);
    }
  };

  const handleConfirmReport = () => {
    onReport();
    setShowReportDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwnPost ? (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={handleReportClick}
              className={isReported ? "text-orange-600" : "text-red-600"}
            >
              {isReported ? (
                <>
                  <FlagOff className="h-4 w-4 mr-2" />
                  Retirar denúncia
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4 mr-2" />
                  Denunciar
                </>
              )}
            </DropdownMenuItem>
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
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
              Ao denunciar este post, ele será ocultado do seu feed e você não verá mais posts deste autor. 
              Esta ação pode ser desfeita posteriormente através do menu "Retirar denúncia".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReport} className="bg-red-600 hover:bg-red-700">
              Confirmar denúncia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostDetailActions;
