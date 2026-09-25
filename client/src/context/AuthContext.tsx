import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'register' | 'forgot-password';
  openAuthModal: (mode?: 'signin' | 'register' | 'forgot-password') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'signin' | 'register' | 'forgot-password') => void;
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register' | 'forgot-password'>('signin');

  useEffect(() => {
    // 1. Retrieve initial active session on page mount/refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('[Supabase Auth] Failed to restore session:', err);
      setLoading(false);
    });

    // 2. Subscribe to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (mode: 'signin' | 'register' | 'forgot-password' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signIn = async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return res;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });
    return res;
  };

  const signOut = async () => {
    const res = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    return res;
  };

  const resetPassword = async (email: string) => {
    const res = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
