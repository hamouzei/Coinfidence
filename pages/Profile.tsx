
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-[#1a2632] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">StudentTracker</h2>
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
            <p className="text-[#617589] dark:text-gray-500 text-xs font-normal leading-normal">StudentTracker v1.0.4</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
