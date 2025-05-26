
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
      const { data, error } = await supabase
        .from('hidden_profiles')
        .select(`
          *,
          profiles!hidden_profiles_hidden_profile_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('hidden_at', { ascending: false });

      if (error) {
        console.error('Error fetching hidden profiles:', error);
        return;
      }

      setHiddenProfiles(data || []);
      setHiddenProfileIds(new Set((data || []).map(hp => hp.hidden_profile_id)));
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
