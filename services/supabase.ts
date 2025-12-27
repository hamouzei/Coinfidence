import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Reads from .env file (Vite automatically loads .env files)
// Credentials are configured in .env file

// Get environment variables
// Fallback to direct values if env vars not loaded (for development)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kkpcebezvgkttthvudnf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WoZM65rzaGlrOVb9CC7CTQ_kupbrDMG';

// Debug: Log what we're getting (only in dev)
if (import.meta.env.DEV) {
  const envLoaded = !!import.meta.env.VITE_SUPABASE_URL;
  console.log('🔍 Supabase Config:', {
    'Env vars loaded': envLoaded,
    'Using fallback': !envLoaded,
    'URL configured': !!supabaseUrl,
    'Key configured': !!supabaseAnonKey,
  });
}

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 
    '❌ Supabase configuration missing!\n' +
    'Please ensure your .env file contains:\n' +
    'VITE_SUPABASE_URL=https://kkpcebezvgkttthvudnf.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
    'Then RESTART your dev server (stop and run npm run dev again).';
  console.error(errorMsg);
  // Don't throw in production - allow graceful degradation
  if (import.meta.env.DEV) {
    throw new Error('Supabase credentials are required. Please check your .env file and restart the dev server.');
  }
}

// Log successful configuration (only in dev, hide in production)
if (supabaseUrl && supabaseAnonKey && import.meta.env.DEV) {
  console.log('✅ Supabase configured successfully');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/#/verify-email`,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },

  // Resend verification email
  resendVerificationEmail: async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/verify-email`,
      },
    });
    return { data, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

