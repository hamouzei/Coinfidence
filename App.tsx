
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ExpenseModal from './components/ExpenseModal';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { Expense, Category, User } from './types';

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', amount: 150.00, category: Category.FOOD, date: '2023-10-24', note: 'Dinner with friends' },
  { id: '2', amount: 120.00, category: Category.TEXTBOOKS, date: '2023-10-23', note: 'Calculus textbook' },
  { id: '3', amount: 60.00, category: Category.TRANSPORT, date: '2023-10-22', note: 'Monthly bus pass' },
  { id: '4', amount: 45.00, category: Category.ENTERTAINMENT, date: '2023-10-21', note: 'Movie night' },
  { id: '5', amount: 4.50, category: Category.FOOD, date: '2023-10-24', note: 'Starbucks run' },
  { id: '6', amount: 2.00, category: Category.TRANSPORT, date: '2023-10-24', note: 'Bus fare to campus' },
];

const AppContent: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const handleAddExpense = (amount: number, category: Category, date: string, note: string) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      category,
      date,
      note,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  if (!user) {
    return <Auth onLogin={(email) => setUser({
      email,
      name: 'Alex Johnson',
      plan: 'Student Plan',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0tfUo_xw_kjGWaXb9-wyVD4oaA-rHPmTfs5E46Y8uAFinYMs1cAHnggwFZc0CJi-ormSdh6G-QsDHrF4ZUE0KnDXdhMpzbrZR2g4vgYe7NJ5F52Wpr1jKRNgYixGzgyPUeZUTocC-gksn7CX_Retb-neX8396fz3C3Qdii9R2Tl-WnB_5VqIHG3JZz3eFNX7BDMVL3i4WuinaZj8h95dZaxtDhyfJKb9VoE0C5JJz9UMdf_-ECVvUEzwzpua-ftjP9mHjogC2Kx3s'
    })} />;
  }

  const isHistory = location.pathname === '/history';
  const isProfile = location.pathname === '/profile';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1A2633] border-b border-[#dbe0e6] dark:border-gray-800 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg dark:text-white">ExpenseTracker</h1>
          </div>
          <button className="text-[#111418] dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          <Routes>
            <Route path="/" element={<Dashboard expenses={expenses} onAddExpense={() => setIsModalOpen(true)} />} />
            <Route path="/history" element={<History expenses={expenses} onAddExpense={() => setIsModalOpen(true)} />} />
            <Route path="/profile" element={<Profile user={user} onLogout={() => setUser(null)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Floating Action Button (Mobile only when on Dashboard) */}
        {!isProfile && (
          <div className="fixed bottom-8 right-8 md:absolute md:bottom-8 md:right-8 z-30">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 font-bold text-base"
            >
              <span className="material-symbols-outlined">add</span>
              Add Expense
            </button>
          </div>
        )}

        {/* Mobile Nav Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex justify-center p-4 pointer-events-none">
          <nav className="pointer-events-auto flex items-center justify-around w-full max-w-sm bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl px-2 py-3 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
            <Link to="/" className="flex flex-col items-center justify-center gap-1 w-16 group">
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/' ? 'text-primary icon-filled' : 'text-gray-400'}`}>home</span>
              <span className={`text-[10px] font-medium ${location.pathname === '/' ? 'text-primary' : 'text-gray-400'}`}>Home</span>
            </Link>
            <Link to="/history" className="flex flex-col items-center justify-center gap-1 w-16 group">
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/history' ? 'text-primary icon-filled' : 'text-gray-400'}`}>receipt_long</span>
              <span className={`text-[10px] font-medium ${location.pathname === '/history' ? 'text-primary' : 'text-gray-400'}`}>Expenses</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center justify-center gap-1 w-16 group">
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/profile' ? 'text-primary icon-filled' : 'text-gray-400'}`}>person</span>
              <span className={`text-[10px] font-medium ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-400'}`}>Profile</span>
            </Link>
          </nav>
        </div>
      </main>

      {isModalOpen && (
        <ExpenseModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddExpense}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
