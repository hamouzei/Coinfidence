import React, { useState } from 'react';
import { authHelpers } from '../services/supabase';

interface AuthProps {
  onLogin: (user: { email: string; name: string; id: string }) => void;
  onSignUpSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignUpSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (!isLogin) {
        // Sign up
        const { data, error } = await authHelpers.signUp(email, password);

        if (error) {
          setErrors({ general: error.message || 'Failed to create account. Please try again.' });
          setIsLoading(false);
          return;
        }

        if (data.user) {
          setShowSuccess(true);
          if (onSignUpSuccess) {
            onSignUpSuccess();
          }
        }
      } else {
        // Sign in
        const { data, error } = await authHelpers.signIn(email, password);

        if (error) {
          setErrors({ general: error.message || 'Invalid email or password.' });
          setIsLoading(false);
          return;
        }

        if (data.user) {
          onLogin({
            email: data.user.email || email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            id: data.user.id,
          });
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const { error } = await authHelpers.resendVerificationEmail(email);
      if (error) {
        setErrors({ general: error.message || 'Failed to resend verification email.' });
      } else {
        setShowSuccess(true);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to resend verification email.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col bg-white dark:bg-surface-dark shadow-xl rounded-2xl overflow-hidden border border-[#f0f2f4] dark:border-[#2a3645]">
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 px-6 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl mt-0.5">
              check_circle
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Verification email sent!
              </p>
              <p className="text-xs text-green-700 dark:text-green-400/80 mt-0.5">
                Please check your inbox to activate your account.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white text-center mb-2">
              Coinfidence
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-4">
              Track your spending. Stay in control.
            </p>
            <h2 className="text-xl font-bold tracking-tight text-[#111418] dark:text-white text-center">
              {isLogin ? 'Welcome back' : 'Start tracking today'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-center">
              {isLogin
                ? 'Log in to your account to continue.'
                : 'Create an account to manage your student budget.'}
            </p>
          </div>

          <div className="flex p-1 mb-8 bg-[#f0f2f4] dark:bg-background-dark rounded-xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
                setShowSuccess(false);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
                setShowSuccess(false);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-300">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium text-[#111418] dark:text-slate-200"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">
                  mail
                </span>
                <input
                  required
                  className={`w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-background-dark border text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all ${
                    errors.email
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-[#dbe0e6] dark:border-[#2e3b4b]'
                  }`}
                  id="email"
                  placeholder="student@university.edu"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  onBlur={() => {
                    if (email && !validateEmail(email)) {
                      setErrors({ ...errors, email: 'Please enter a valid email address' });
                    }
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 dark:text-red-400 pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium text-[#111418] dark:text-slate-200"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">
                  lock
                </span>
                <input
                  required
                  className={`w-full h-12 pl-11 pr-11 rounded-xl bg-white dark:bg-background-dark border text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all ${
                    errors.password
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-[#dbe0e6] dark:border-[#2e3b4b]'
                  }`}
                  id="password"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  onBlur={() => {
                    if (password && password.length < 8) {
                      setErrors({ ...errors, password: 'Password must be at least 8 characters' });
                    }
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-500 dark:text-red-400 pl-1">
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-[#111418] dark:text-slate-200"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">
                    lock_reset
                  </span>
                  <input
                    required
                    className={`w-full h-12 pl-11 pr-11 rounded-xl bg-white dark:bg-background-dark border text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-[#dbe0e6] dark:border-[#2e3b4b]'
                    }`}
                    id="confirm-password"
                    placeholder="Re-enter password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    onBlur={() => {
                      if (confirmPassword && password !== confirmPassword) {
                        setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
                      }
                    }}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword ? 'confirm-password-error' : undefined
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p
                    id="confirm-password-error"
                    className="text-xs text-red-500 dark:text-red-400 pl-1"
                  >
                    {errors.confirmPassword}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">
                    Must be at least 8 characters.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
            {isLogin && (
              <button
                type="button"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary mt-2 text-center"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            )}
          </form>

          {showSuccess && !isLogin && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                Didn't receive the email?
              </p>
              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                Resend verification email
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setShowSuccess(false);
              }}
              className="font-semibold text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            By clicking continue, you agree to our{' '}
            <a
              className="underline hover:text-slate-600 dark:hover:text-slate-300"
              href="#"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              className="underline hover:text-slate-600 dark:hover:text-slate-300"
              href="#"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Auth;
