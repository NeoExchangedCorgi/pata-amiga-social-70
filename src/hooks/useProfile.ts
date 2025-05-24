
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { user, profile, updateProfile: updateAuthProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (updates: {
    full_name?: string;
    bio?: string;
    phone?: string;
  }) => {
    if (!user) return { error: 'Usuário não autenticado' };

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      await updateAuthProfile(updates);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'Usuário não autenticado' };

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { error: uploadError.message };
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        return { error: updateError.message };
      }

      await updateAuthProfile({ avatar_url: data.publicUrl });
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada!",
      });
      return { success: true, url: data.publicUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    changePassword,
    isLoading,
  };
};
