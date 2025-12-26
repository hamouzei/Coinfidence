
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      setShowSuccess(true);
      setTimeout(() => onLogin(email || 'jane.doe@example.com'), 2000);
    } else {
      onLogin(email || 'jane.doe@example.com');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col bg-white dark:bg-surface-dark shadow-xl rounded-2xl overflow-hidden border border-[#f0f2f4] dark:border-[#2a3645]">
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 px-6 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl mt-0.5">check_circle</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">Verification email sent!</p>
              <p className="text-xs text-green-700 dark:text-green-400/80 mt-0.5">Please check your inbox to activate your account.</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white text-center">
              {isLogin ? 'Welcome back' : 'Start tracking today'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center">
              {isLogin ? 'Log in to your account to continue.' : 'Create an account to manage your student budget.'}
            </p>
          </div>

          <div className="flex p-1 mb-8 bg-[#f0f2f4] dark:bg-background-dark rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white' : 'text-slate-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white' : 'text-slate-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111418] dark:text-slate-200" htmlFor="email">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">mail</span>
                <input 
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-background-dark border border-[#dbe0e6] dark:border-[#2e3b4b] text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all" 
                  id="email" 
                  placeholder="student@university.edu" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#111418] dark:text-slate-200" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">lock</span>
                <input 
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-white dark:bg-background-dark border border-[#dbe0e6] dark:border-[#2e3b4b] text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all" 
                  id="password" 
                  placeholder={isLogin ? "Enter your password" : "Create a password"} 
                  type="password"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#111418] dark:text-slate-200" htmlFor="confirm-password">Confirm Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500 material-symbols-outlined text-[20px]">lock_reset</span>
                  <input 
                    required
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white dark:bg-background-dark border border-[#dbe0e6] dark:border-[#2e3b4b] text-[#111418] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all" 
                    id="confirm-password" 
                    placeholder="Re-enter password" 
                    type="password"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">Must be at least 8 characters.</p>
              </div>
            )}

            <button type="submit" className="mt-2 w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <span>{isLogin ? 'Login' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-primary hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            By clicking continue, you agree to our <a className="underline hover:text-slate-600 dark:hover:text-slate-300" href="#">Terms of Service</a> and <a className="underline hover:text-slate-600 dark:hover:text-slate-300" href="#">Privacy Policy</a>.
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
