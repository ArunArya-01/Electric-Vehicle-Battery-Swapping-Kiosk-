// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

// Define the shape of your Profile
export interface Profile {
  id: string;
  role: 'admin' | 'user' | null;
  email: string;
  full_name: string | null; // <-- This is the new line
}

// Define the shape of the context value
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // This async function checks for a session and profile
    const checkUserSession = async () => {
      try {
        // This is the timeout-proof session request
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase request timed out after 5 seconds')), 5000)
        );

        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise as Promise<{ data: { session: Session | null } }>
        ]);
        
        setSession(session);

        if (session) {
          // User is logged in, fetch their profile
          const { data, error } = await supabase
            .from('profiles')
            .select('*') // Selects all columns (including full_name)
            .eq('id', session.user.id)
            .single<Profile>();
          
          if (error) throw error;
          setProfile(data);
        }
      } catch (error: any) {
        console.error("AuthContext (checkUserSession) Error:", error.message);
        setProfile(null);
      } finally {
        // This guarantees we stop loading
        setLoading(false);
      }
    };

    // Run the check
    checkUserSession();

    // This listener handles all *future* auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setProfile(null); // Clear old profile first

        if (session && event === 'SIGNED_IN') {
           try {
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single<Profile>();
              if (error) throw error;
              setProfile(data);
            } catch (error: any) {
              console.error('Error fetching profile on SIGNED_IN:', error.message);
            }
        }
      }
    );

    // Cleanup
    return () => subscription.unsubscribe();
  }, []);


  // Function to sign out the user
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    signOut,
    loading,
  };

  // We always render children now
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the Auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}