import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  onboarding_completed: boolean;
  subscription_status: string | null;
  trial_started_at: string | null;
  care_days_count: number;
  last_recognition_copy_key: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithOAuth: (provider: 'google') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('id, email, display_name, onboarding_completed, subscription_status, trial_started_at, care_days_count, last_recognition_copy_key')
      .eq('id', userId)
      .single();
    if (data) {
      setProfile({
        id: data.id,
        email: data.email ?? null,
        display_name: data.display_name ?? null,
        onboarding_completed: data.onboarding_completed ?? false,
        subscription_status: data.subscription_status ?? null,
        trial_started_at: data.trial_started_at ?? null,
        care_days_count: Number(data.care_days_count ?? 0),
        last_recognition_copy_key: data.last_recognition_copy_key ?? null,
      });
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithOAuth = useCallback(async (provider: 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const value: AuthContextValue = {
    user,
    session,
    profile,
    loading,
    signInWithOAuth,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
