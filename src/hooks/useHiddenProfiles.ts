
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HiddenProfile {
  id: string;
  user_id: string;
  hidden_profile_id: string;
  hidden_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useHiddenProfiles = () => {
  const [hiddenProfiles, setHiddenProfiles] = useState<HiddenProfile[]>([]);
  const [hiddenProfileIds, setHiddenProfileIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHiddenProfiles = async () => {
    if (!user) return;

    try {
      // Primeiro buscar os perfis ocultos
      const { data: hiddenData, error: hiddenError } = await supabase
        .from('hidden_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('hidden_at', { ascending: false });

      if (hiddenError) {
        console.error('Error fetching hidden profiles:', hiddenError);
        return;
      }

      if (!hiddenData || hiddenData.length === 0) {
        setHiddenProfiles([]);
        setHiddenProfileIds(new Set());
        return;
      }

      // Buscar os dados dos perfis
      const profileIds = hiddenData.map(hp => hp.hidden_profile_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', profileIds);

      if (profilesError) {
        console.error('Error fetching profile details:', profilesError);
        return;
      }

      // Combinar os dados
      const combinedData: HiddenProfile[] = hiddenData.map(hiddenProfile => {
        const profile = profilesData?.find(p => p.id === hiddenProfile.hidden_profile_id);
        return {
          ...hiddenProfile,
          profiles: profile || {
            id: hiddenProfile.hidden_profile_id,
            username: 'Usuário desconhecido',
            full_name: 'Usuário desconhecido',
            avatar_url: undefined
          }
        };
      });

      setHiddenProfiles(combinedData);
      setHiddenProfileIds(new Set(hiddenData.map(hp => hp.hidden_profile_id)));
    } catch (error) {
      console.error('Error fetching hidden profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hideProfile = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para ocultar perfis",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('hidden_profiles')
        .insert({
          user_id: user.id,
          hidden_profile_id: profileId,
        });

      if (error) {
        console.error('Error hiding profile:', error);
        toast({
          title: "Erro",
          description: "Erro ao ocultar perfil. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      setHiddenProfileIds(prev => new Set([...prev, profileId]));
      await fetchHiddenProfiles();
      
      toast({
        title: "Perfil ocultado",
        description: "O perfil foi ocultado da sua feed.",
      });
      
      return true;
    } catch (error) {
      console.error('Error hiding profile:', error);
      return false;
    }
  };

  const unhideProfile = async (profileId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('hidden_profiles')
        .delete()
        .eq('user_id', user.id)
        .eq('hidden_profile_id', profileId);

      if (error) {
        console.error('Error unhiding profile:', error);
        toast({
          title: "Erro",
          description: "Erro ao desocultar perfil. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      setHiddenProfileIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
      
      await fetchHiddenProfiles();
      
      toast({
        title: "Perfil desocultado",
        description: "O perfil voltará a aparecer na sua feed.",
      });
      
      return true;
    } catch (error) {
      console.error('Error unhiding profile:', error);
      return false;
    }
  };

  const isProfileHidden = (profileId: string) => {
    return hiddenProfileIds.has(profileId);
  };

  useEffect(() => {
    fetchHiddenProfiles();
  }, [user]);

  return {
    hiddenProfiles,
    isLoading,
    hideProfile,
    unhideProfile,
    isProfileHidden,
    refetch: fetchHiddenProfiles,
  };
};
