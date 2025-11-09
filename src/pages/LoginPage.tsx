// src/pages/LoginPage.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import type { Provider, AuthResponse } from '@supabase/supabase-js';
import { useAuth } from '@/context/AuthContext';
import { Battery } from 'lucide-react'; // Import your brand icon

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const { user, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      return; 
    }
    
    if (user && profile) {
      toast.info("You are already logged in.");
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // --- SIGN UP LOGIC ---
      try {
        const signUpPromise = supabase.auth.signUp({
          email: email,
          password: password,
          options: { emailRedirectTo: window.location.origin },
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign-up request timed out')), 5000)
        );

        const { data, error } = await Promise.race([
          signUpPromise, 
          timeoutPromise as Promise<AuthResponse>
        ]);

        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
        setIsSignUp(false);

      } catch (error: any) {
        toast.error(error.error_description || error.message);
      } finally {
        setLoading(false);
      }

    } else {
      // --- SIGN IN LOGIC ---
      try {
        const signInPromise = supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign-in request timed out')), 5000)
        );
        
        const { data: authData, error: authError } = await Promise.race([
          signInPromise,
          timeoutPromise as Promise<AuthResponse>
        ]);

        if (authError) throw authError;
        // Success! The AuthContext will now take over and redirect.

      } catch (error: any) {
        toast.error(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleSocialLogin = async (provider: Provider) => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({ provider: provider });
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };


  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    // Use theme colors for background
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Use theme card, radius, and shadow */}
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
        
        <div className="text-center">
          {/* Added your brand icon and gradient text */}
          <Battery className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isSignUp ? 'Create an Account' : 'Welcome to SwapCharge'}
          </h1>
          {/* Use muted foreground for description */}
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? 'Get started by creating a new account' : 'Sign in to your account to continue'}
          </p> 
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            // Use theme border, background, text, and hover colors
            className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-md shadow-sm bg-background text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            {/* We can add a Google icon here later if you want */}
            Sign in with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            {/* Use theme border color */}
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            {/* Use theme card background and text color */}
            <span className="px-2 bg-card text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            {/* Use theme muted text for labels */}
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email address
            </label>
            <input
              id="email" type="email" placeholder="your@email.com"
              value={email} required={true}
              onChange={(e) => setEmail(e.target.value)}
              // Use theme colors for input, border, and focus ring
              className="w-full px-3 py-2 mt-1 border border-input rounded-md shadow-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password" type="password" placeholder="Your password"
              value={password} required={true}
              onChange={(e) => setPassword(e.target.value)}
              // Use theme colors for input, border, and focus ring
              className="w-full px-3 py-2 mt-1 border border-input rounded-md shadow-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <button 
              type="submit" disabled={loading}
              // Use theme primary colors for the main button
              className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-card disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setIsSignUp(!isSignUp);
            }} 
            // Use theme primary color for the link
            className="font-medium text-primary hover:text-primary/80"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </a>
        </div>
        
      </div>
    </div>
  );
}