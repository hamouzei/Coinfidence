
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-[#1A2633] border-r border-[#dbe0e6] dark:border-gray-800 hidden md:flex flex-col justify-between shrink-0 z-20">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0" 
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtKQEyHmMOUuVzGRcfW-jnYR_rIr5CGiKJ9yS5ZOQpP_d9avVanJ5D0ncbZVIdY-xFEja-zGkIa5qjhgOWafTu5_rjtn1ZzL87gIX_nH1fxPCpG6Unvs_X2j80tCisEN0xgKeAYaHAEzD3JNh6tRtE2lU2q_u83CuqAyx0LsEx6lbo8W9JStCXIAlt1prIpaTgaA9SYDPORXUGYxs1jbd93P3OLmtxpNl1SsB31BjOLUfEBaA_KgkIG8UlpSMQ7sXqUd6weqC-UYeS")` }}
          />
          <h1 className="text-[#111418] dark:text-white text-lg font-bold leading-normal tracking-tight">Coinfidence</h1>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-[#111418] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-800'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive('/') ? 'icon-filled' : ''}`}>home</span>
            <p className="text-sm font-semibold leading-normal">Home</p>
          </Link>
          <Link 
            to="/history" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/history') ? 'bg-primary/10 text-primary' : 'text-[#111418] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-800'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive('/history') ? 'icon-filled' : ''}`}>history</span>
            <p className="text-sm font-medium leading-normal">History</p>
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive('/profile') ? 'bg-primary/10 text-primary' : 'text-[#111418] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-800'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? 'icon-filled' : ''}`}>settings</span>
            <p className="text-sm font-medium leading-normal">Settings</p>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-[#dbe0e6] dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
            style={{ backgroundImage: `url("${user.avatar}")` }}
          />
          <div className="flex flex-col">
            <p className="text-[#111418] dark:text-white text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-[#617589] dark:text-gray-500 text-xs font-normal leading-normal">{user.plan}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
