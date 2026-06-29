import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = '/login' } = options ?? {};
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get initial session + listen for auth changes
  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (error) {
            setError(error);
          } else {
            setUser(session?.user ?? null);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Optional redirect if user is not logged in
  useEffect(() => {
    if (!redirectOnUnauthenticated || loading) return;
    if (user) return;
    if (typeof window === 'undefined') return;

    window.location.href = redirectPath;
  }, [user, loading, redirectOnUnauthenticated, redirectPath]);

  // Sign in with email + password
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  }, []);

  // Sign up with email + password
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || '' }
      }
    });

    if (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refresh,
  };
}
