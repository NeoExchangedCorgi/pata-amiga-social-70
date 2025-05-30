
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

interface AdminProfileActionsProps {
  userId: string;
  username: string;
  isOwnProfile: boolean;
}

const AdminProfileActions = ({ userId, username, isOwnProfile }: AdminProfileActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { canDeleteAnyProfile } = useAdminPrivileges();
  const { toast } = useToast();

  if (!canDeleteAnyProfile || isOwnProfile) {
    return null;
  }

  const handleDeleteProfile = () => {
    // TODO: Implementar a exclusão real do perfil quando o backend estiver pronto
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de perfis será implementada com o backend",
      className: "bg-blue-500 text-white border-blue-600",
    });
    setShowDeleteDialog(false);
    // window.location.reload();
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="bg-red-600 hover:bg-red-700"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Excluir Perfil (Admin)
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir perfil (Administrador)</AlertDialogTitle>
            <AlertDialogDescription>
              Como administrador, você está prestes a excluir permanentemente o perfil de @{username}. 
              Esta ação não pode ser desfeita e todos os dados do usuário serão removidos do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProfile} 
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

export default AdminProfileActions;
