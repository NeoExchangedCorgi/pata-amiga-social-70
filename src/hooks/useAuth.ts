
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  username: string;
  phone: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              email: session.user.email || '',
              fullName: profile.full_name,
              username: profile.username,
              phone: profile.phone || '',
              bio: profile.bio,
              avatarUrl: profile.avatar_url,
              createdAt: profile.created_at,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (userData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    phone: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
          username: userData.username,
          phone: userData.phone,
        }
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        username: updates.username,
        phone: updates.phone,
        bio: updates.bio,
        avatar_url: updates.avatarUrl,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setUser({
        ...user,
        fullName: data.full_name,
        username: data.username,
        phone: data.phone || '',
        bio: data.bio,
        avatarUrl: data.avatar_url,
      });
    }

    return { data, error };
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
