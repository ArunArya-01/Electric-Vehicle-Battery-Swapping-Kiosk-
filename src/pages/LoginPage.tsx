// src/pages/LoginPage.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import type { Provider, AuthResponse } from '@supabase/supabase-js'; // Import AuthResponse
import { useAuth } from '@/context/AuthContext';

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

  
  // --- UPDATED handleSubmit with TIMEOUT ---
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // --- SIGN UP LOGIC (with timeout) ---
      try {
        const signUpPromise = supabase.auth.signUp({
          email: email,
          password: password,
          options: { emailRedirectTo: window.location.origin },
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign-up request timed out')), 5000)
        );

        // Race the sign-up against the timeout
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
      // --- SIGN IN LOGIC (with timeout) ---
      try {
        const signInPromise = supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Sign-in request timed out')), 5000)
        );
        
        // Race the sign-in against the timeout
        const { data: authData, error: authError } = await Promise.race([
          signInPromise,
          timeoutPromise as Promise<AuthResponse>
        ]);

        if (authError) throw authError;
        // Success! The AuthContext will now take over and redirect.

      } catch (error: any) {
        toast.error(error.error_description || error.message);
      } finally {
        // This will now run even if the request times out
        setLoading(false);
      }
    }
  };
  // --- END OF UPDATED FUNCTION ---


  const handleSocialLogin = async (provider: Provider) => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({ provider: provider });
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
    // We don't set loading false here because the user is redirected
  };


  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Get started by creating a new account' : 'Sign in to your account to continue'}
          </p> 
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Sign in with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email" type="email" placeholder="your@email.com"
              value={email} required={true}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password" type="password" placeholder="Your password"
              value={password} required={true}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button 
              type="submit" disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
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
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </a>
        </div>
        
      </div>
    </div>
  );
}