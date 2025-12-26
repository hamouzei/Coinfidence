
import React, { useState } from 'react';
import { Category } from '../types';

interface ExpenseModalProps {
  onClose: () => void;
  onSave: (amount: number, category: Category, date: string, note: string) => void;
}

const CATEGORIES = [
  { id: Category.FOOD, icon: 'restaurant' },
  { id: Category.TRANSPORT, icon: 'directions_bus' },
  { id: Category.RENT, icon: 'home' },
  { id: Category.INTERNET, icon: 'wifi' },
  { id: Category.OTHER, icon: 'sell' },
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.FOOD);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onSave(numAmount, selectedCategory, date, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-[450px] bg-white dark:bg-[#1A2633] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Expense</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="flex flex-col items-center justify-center py-6 mb-2">
            <div className="relative group">
              <div className="flex items-baseline justify-center gap-1 text-primary">
                <span className="text-3xl font-bold opacity-70">$</span>
                <input 
                  autoFocus
                  className="block w-48 border-0 bg-transparent p-0 text-center text-6xl font-bold text-primary placeholder:text-primary/30 focus:ring-0" 
                  placeholder="0.00" 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2">Enter amount</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Category</label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-all ${
                    selectedCategory === cat.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                    selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-600'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  </div>
                  <span className={`text-[10px] font-semibold truncate w-full text-center ${
                    selectedCategory === cat.id ? 'text-primary' : 'text-slate-600 dark:text-slate-400'
                  }`}>{cat.id.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <input 
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 pl-10 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer" 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-[2]">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Note</label>
                <input 
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  placeholder="Add a note (optional)..." 
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-white dark:bg-[#1A2633]">
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!amount}
              className="flex-[2] rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
