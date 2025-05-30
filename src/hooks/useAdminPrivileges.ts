
import { useAuth } from '@/contexts/AuthContext';

export const useAdminPrivileges = () => {
  const { user, profile } = useAuth();

  // TODO: Implementar verificação real de admin quando o novo banco estiver pronto
  // Por enquanto, consideramos que todos os usuários são não-admin
  const isAdmin = false; // Será implementado com o novo banco

  const canDeleteAnyPost = isAdmin;
  const canDeleteAnyProfile = isAdmin;

  return {
    isAdmin,
    canDeleteAnyPost,
    canDeleteAnyProfile,
  };
};
