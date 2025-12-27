import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authHelpers } from '../services/supabase';

const EmailVerification: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Check if there's a token in the URL (Supabase email verification)
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (token && type === 'signup') {
          // Supabase handles verification automatically via URL
          // Check if user is now verified
          const { user, error: userError } = await authHelpers.getUser();
          
          if (userError) {
            setError('Verification link expired or invalid.');
            setIsLoading(false);
            return;
          }

          if (user && user.email_confirmed_at) {
            setIsVerified(true);
          } else {
            setError('Email verification is still pending. Please check your email.');
          }
        } else {
          // Check current session to see if user is verified
          const { session } = await authHelpers.getSession();
          if (session?.user?.email_confirmed_at) {
            setIsVerified(true);
          } else {
            setError('Please verify your email by clicking the link sent to your inbox.');
          }
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while verifying your email.');
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-[440px] flex flex-col bg-white dark:bg-[#1A2633] shadow-xl rounded-2xl overflow-hidden border border-[#f0f2f4] dark:border-[#2a3645] p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                sync
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white mb-3">
              Verifying...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please wait while we verify your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isVerified) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-[440px] flex flex-col bg-white dark:bg-[#1A2633] shadow-xl rounded-2xl overflow-hidden border border-[#f0f2f4] dark:border-[#2a3645] p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                error
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white mb-3">
              Verification Failed
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              {error}
            </p>
            <button
              onClick={handleContinue}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Back to Login</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col bg-white dark:bg-[#1A2633] shadow-xl rounded-2xl overflow-hidden border border-[#f0f2f4] dark:border-[#2a3645] p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white mb-3">
            Email Verified!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Your email has been verified successfully. You can now log in to your account.
          </p>
          <button
            onClick={handleContinue}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <span>Continue to Login</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default EmailVerification;
