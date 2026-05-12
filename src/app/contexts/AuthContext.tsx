import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Auth Context
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | undefined>;
  signup: (email: string, password: string, name: string) => Promise<User | undefined>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let isInitialized = false;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('🌐 Current pathname:', window.location.pathname);

        // Check if we're coming back from OAuth redirect
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);

        console.log('🔍 URL hash:', window.location.hash);
        console.log('🔍 URL search:', window.location.search);
        console.log('🔍 Hash params:', Array.from(hashParams.keys()));
        console.log('🔍 Search params:', Array.from(urlParams.keys()));

        const hasOAuthParams = hashParams.has('access_token') || urlParams.has('code') || hashParams.has('error');
        if (hasOAuthParams) {
          console.log('✅ OAuth callback detected in URL!');
          console.log('🔗 Hash params:', Object.fromEntries(hashParams));
          console.log('🔗 URL search params:', Object.fromEntries(urlParams));

          if (hashParams.has('error')) {
            console.error('❌ OAuth error in URL:', hashParams.get('error'));
            console.error('❌ OAuth error description:', hashParams.get('error_description'));
          }
        } else {
          console.log('ℹ️ No OAuth parameters in URL');
        }

        // Check localStorage first
        const storedSession = localStorage.getItem('sb-luokxzkqekitqdmzvrhf-auth-token');
        console.log('💾 Session in localStorage during init:', !!storedSession);
        if (storedSession) {
          console.log('💾 Stored session preview:', storedSession.substring(0, 100) + '...');
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error fetching session:', error);
          console.log("No session found");
          if (isMounted) {
            setUser(null);
          }
        } else if (session?.user) {
          console.log("✅ Session found:", session.user.email);
          console.log('✅ Session access token:', session.access_token?.substring(0, 20) + '...');
          if (isMounted) {
            await loadUserProfile(session.user);
            console.log("✅ User restored from session");
          }
        } else {
          console.log("⚠️ No session found");
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
        console.log("No session");
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isInitialized = true;
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event, "User:", session?.user?.email);

      // ALWAYS process SIGNED_IN events (e.g., OAuth callback) even during initialization
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("✅ SIGNED_IN event - processing immediately (could be OAuth callback)");
        await loadUserProfile(session.user);
        console.log("✅ User profile loaded from SIGNED_IN event");
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      // For other events, only process after initial auth check
      if (!isInitialized) {
        console.log("⏳ Skipping auth state change - not yet initialized (event:", event + ")");
        return;
      }

      if (session?.user) {
        console.log("♻️ Session updated (not SIGNED_IN event)");
        await loadUserProfile(session.user);
        console.log("✅ User profile updated");
      } else if (event === 'SIGNED_OUT') {
        console.log("👋 User signed out");
        setUser(null);
      } else {
        console.log("ℹ️ Auth state change ignored (session still initializing)");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🔥 Load user profile from metadata
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log('🔍 Loading user profile from Supabase user:', {
      id: supabaseUser.id,
      email: supabaseUser.email,
      user_metadata: supabaseUser.user_metadata,
    });

    // Extract name from various possible fields (OAuth providers use different fields)
    const name =
      supabaseUser.user_metadata?.name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.display_name ||
      supabaseUser.email?.split('@')[0] ||
      'User';

    // Extract avatar from various possible fields
    const avatar_url =
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      supabaseUser.user_metadata?.avatar ||
      undefined;

    const userProfile: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name,
      avatar_url,
    };

    console.log('✅ User profile created:', userProfile);
    setUser(userProfile);
    return userProfile;
  };

  const login = async (email: string, password: string): Promise<User | undefined> => {
    console.log('🔐 Login attempt for:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login error:', error);
      throw error;
    }

    console.log('✅ Login successful, session data:', {
      user: data.user?.email,
      session: !!data.session,
      access_token: data.session?.access_token?.substring(0, 20) + '...',
    });

    // Check if session is in localStorage
    const storedSession = localStorage.getItem('sb-luokxzkqekitqdmzvrhf-auth-token');
    console.log('💾 Session in localStorage:', !!storedSession);

    if (data.user) {
      const profile = await loadUserProfile(data.user);
      console.log('👤 User profile loaded after login:', profile);
      return profile;
    }

    return undefined;
  };

  const signup = async (email: string, password: string, name: string): Promise<User | undefined> => {
    // Use server-side signup to avoid email rate limits (email_confirm: true on server)
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-bf94089b/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    // Now sign in with the created account
    const signInResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInResult.error) {
      throw signInResult.error;
    }

    if (signInResult.data.user) {
      return await loadUserProfile(signInResult.data.user);
    }

    return undefined;
  };

  const loginWithOAuth = async (provider: 'google' | 'github') => {
    console.log(`🔐 Starting OAuth login with ${provider}`);
    console.log(`🔗 Redirect URL: ${window.location.origin}/land_analyzer`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/land_analyzer`,
      },
    });

    if (error) {
      console.error(`❌ OAuth ${provider} error:`, error);
      throw error;
    }

    console.log(`✅ OAuth ${provider} initiated - redirecting to provider...`);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2C4C3B]/20 border-t-[#2C4C3B] rounded-full animate-spin"></div>
          <p className="text-[#2C4C3B] font-medium animate-pulse">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}