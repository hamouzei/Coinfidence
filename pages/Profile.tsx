
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userSettingsService } from '../services/userSettingsService';
import { darkMode } from '../utils/darkMode';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onBudgetUpdate?: (budget: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onBudgetUpdate }) => {
  const [budget, setBudget] = useState<string>((user.monthlyBudget || 600).toString());
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [budgetError, setBudgetError] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(darkMode.getTheme());

  useEffect(() => {
    setBudget((user.monthlyBudget || 600).toString());
  }, [user.monthlyBudget]);

  useEffect(() => {
    // Update theme state when it changes
    const updateTheme = () => {
      setCurrentTheme(darkMode.getTheme());
    };
    
    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    updateTheme();
    
    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = () => {
    const newTheme = darkMode.toggle();
    setCurrentTheme(newTheme);
  };

  const handleSaveBudget = async () => {
    const numBudget = parseFloat(budget);
    
    if (isNaN(numBudget) || numBudget <= 0) {
      setBudgetError('Budget must be a number greater than 0');
      return;
    }

    if (numBudget > 999999.99) {
      setBudgetError('Budget cannot exceed $999,999.99');
      return;
    }

    setIsSavingBudget(true);
    setBudgetError('');

    try {
      const settings = await userSettingsService.updateBudget(numBudget);
      setIsEditingBudget(false);
      if (onBudgetUpdate) {
        onBudgetUpdate(settings.monthly_budget);
      }
    } catch (error: any) {
      setBudgetError(error.message || 'Failed to update budget. Please try again.');
    } finally {
      setIsSavingBudget(false);
    }
  };

  const handleCancelBudget = () => {
    setBudget((user.monthlyBudget || 600).toString());
    setIsEditingBudget(false);
    setBudgetError('');
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-[#1a2632] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Coinfidence</h2>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-3 px-2">
            <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight">Profile & Settings</h1>
          </div>

          <div className="flex flex-col items-center bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-800 p-8 gap-8">
            <div className="flex flex-col items-center w-full gap-4">
              <div className="relative group">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 shadow-inner ring-4 ring-[#f0f2f4] dark:ring-gray-700" 
                  style={{ backgroundImage: `url("${user.avatar}")` }}
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal mb-1">Signed in as</p>
                <p className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">{user.email}</p>
                <p className="text-primary font-semibold text-sm mt-1">{user.name}</p>
              </div>
            </div>

            <div className="w-full h-px bg-[#f0f2f4] dark:bg-gray-700"></div>

            {/* Budget Settings */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-[#111418] dark:text-white text-base font-bold">Monthly Budget</h3>
                  <p className="text-[#617589] dark:text-gray-400 text-sm">Set your monthly spending limit</p>
                </div>
                {!isEditingBudget && (
                  <button
                    onClick={() => setIsEditingBudget(true)}
                    className="text-primary hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingBudget ? (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#617589] dark:text-gray-400 text-sm font-medium">$</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => {
                        setBudget(e.target.value);
                        setBudgetError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveBudget();
                        } else if (e.key === 'Escape') {
                          handleCancelBudget();
                        }
                      }}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1A2633] text-[#111418] dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="600.00"
                      min="0.01"
                      max="999999.99"
                      step="0.01"
                      autoFocus
                    />
                  </div>
                  {budgetError && (
                    <p className="text-red-500 dark:text-red-400 text-xs">{budgetError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBudget}
                      disabled={isSavingBudget}
                      className="flex-1 rounded-lg bg-primary hover:bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSavingBudget ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                    <button
                      onClick={handleCancelBudget}
                      disabled={isSavingBudget}
                      className="flex-1 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-transparent py-2.5 text-sm font-semibold text-[#617589] dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f0f2f4] dark:bg-gray-800">
                  <span className="material-symbols-outlined text-[#617589] dark:text-gray-400 text-[20px]">account_balance_wallet</span>
                  <span className="text-[#111418] dark:text-white text-lg font-bold">
                    ${parseFloat(budget || '600').toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-[#f0f2f4] dark:bg-gray-700"></div>

            {/* Dark Mode Toggle */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-[#111418] dark:text-white text-base font-bold">Appearance</h3>
                  <p className="text-[#617589] dark:text-gray-400 text-sm">Choose your preferred theme</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border border-transparent hover:border-[#dbe0e6] dark:hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#617589] dark:text-gray-400 text-[20px]">
                    {currentTheme === 'dark' ? 'dark_mode' : 'light_mode'}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#111418] dark:text-white text-sm font-semibold">
                      {currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <span className="text-[#617589] dark:text-gray-400 text-xs">
                      {currentTheme === 'dark' ? 'Dark theme is active' : 'Light theme is active'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleToggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                    currentTheme === 'dark' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={currentTheme === 'dark'}
                  aria-label="Toggle dark mode"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      currentTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-[#f0f2f4] dark:bg-gray-700"></div>

            <div className="w-full flex flex-col gap-4">
              <button 
                onClick={onLogout}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined mr-2 text-[20px]">logout</span>
                <span className="truncate">Logout</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <p className="text-[#617589] dark:text-gray-500 text-xs font-normal leading-normal">Coinfidence v1.0.0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
