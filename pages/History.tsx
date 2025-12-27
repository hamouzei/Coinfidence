
import React, { useMemo, useState } from 'react';
import { Expense, Category } from '../types';
import { formatDate } from '../utils/dateFormatter';

interface HistoryProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense }) => {
  const [hoveredExpense, setHoveredExpense] = useState<string | null>(null);

  const groupedExpenses = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const groups: Record<string, Expense[]> = {};
    sorted.forEach((e) => {
      const label = formatDate(e.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(e);
    });
    return Object.entries(groups);
  }, [expenses]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryIcons: Record<string, { icon: string, bg: string, text: string }> = {
    [Category.FOOD]: { icon: 'local_cafe', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    [Category.TRANSPORT]: { icon: 'directions_bus', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    [Category.TEXTBOOKS]: { icon: 'menu_book', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    [Category.ENTERTAINMENT]: { icon: 'movie', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    [Category.OTHER]: { icon: 'sell', bg: 'bg-slate-100 dark:bg-slate-700/30', text: 'text-slate-600 dark:text-slate-400' },
  };

  return (
    <div className="w-full max-w-[960px] mx-auto flex flex-col h-full grow">
      <header className="sticky top-0 z-20 flex flex-col bg-white dark:bg-[#1a2632] border-b border-[#f0f2f4] dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold leading-tight tracking-tight">Expense History</h2>
          </div>
          <button 
            onClick={onAddExpense}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-600 text-white px-4 py-2 text-sm font-bold transition-colors shadow-sm shadow-blue-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar px-6 pb-4 pt-1">
          <div className="flex gap-3">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 px-4 transition-colors">
              <p className="text-primary text-sm font-medium">All Categories</p>
              <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f0f2f4] dark:bg-gray-800 dark:text-gray-300 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <p className="text-sm font-medium">This Month</p>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 md:px-6 py-6 pb-28">
        <div className="flex flex-col items-center justify-center py-6">
          <h2 className="text-3xl font-bold tracking-tight text-center dark:text-white">${totalSpent.toFixed(2)}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Total spent this month</p>
        </div>

        {groupedExpenses.map(([dateLabel, items]) => (
          <div key={dateLabel} className="mb-6">
            <div className="sticky top-[110px] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-2 mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{dateLabel}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((e) => {
                const styles = categoryIcons[e.category] || categoryIcons[Category.OTHER];
                const isHovered = hoveredExpense === e.id;
                return (
                  <div
                    key={e.id}
                    className="group relative flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-transparent hover:border-primary/20 transition-all duration-200"
                    onMouseEnter={() => setHoveredExpense(e.id)}
                    onMouseLeave={() => setHoveredExpense(null)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${styles.bg} ${styles.text}`}
                      >
                        <span className="material-symbols-outlined">{styles.icon}</span>
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-base font-semibold leading-tight truncate dark:text-white">
                          {e.note || e.category}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-normal truncate">
                          {e.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-base font-bold text-[#111418] dark:text-white">
                        ${e.amount.toFixed(2)}
                      </p>
                      {(isHovered || onEditExpense || onDeleteExpense) && (
                        <div className="flex items-center gap-2">
                          {onEditExpense && (
                            <button
                              onClick={() => onEditExpense(e)}
                              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                              aria-label="Edit expense"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                          )}
                          {onDeleteExpense && (
                            <button
                              onClick={() => onDeleteExpense(e.id)}
                              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              aria-label="Delete expense"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">
                checklist
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No expenses yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 max-w-sm">
              Start tracking today to see your spending history here.
            </p>
            <button
              onClick={onAddExpense}
              className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Add Your First Expense
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
