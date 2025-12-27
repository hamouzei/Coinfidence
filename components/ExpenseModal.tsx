import React, { useState, useEffect } from 'react';
import { Category, Expense } from '../types';

interface ExpenseModalProps {
  onClose: () => void;
  onSave: (amount: number, category: Category, date: string, note: string) => void;
  onDelete?: (id: string) => void;
  expense?: Expense | null;
}

const CATEGORIES = [
  { id: Category.FOOD, icon: 'restaurant' },
  { id: Category.TRANSPORT, icon: 'directions_bus' },
  { id: Category.RENT, icon: 'home' },
  { id: Category.INTERNET, icon: 'wifi' },
  { id: Category.TEXTBOOKS, icon: 'menu_book' },
  { id: Category.ENTERTAINMENT, icon: 'sports_esports' },
  { id: Category.OTHER, icon: 'sell' },
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onSave, onDelete, expense }) => {
  const isEditMode = !!expense;
  const [amount, setAmount] = useState<string>(expense?.amount.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState<Category>(expense?.category || Category.FOOD);
  const [date, setDate] = useState<string>(expense?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>(expense?.note || '');
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setSelectedCategory(expense.category);
      setDate(expense.date);
      setNote(expense.note);
    }
  }, [expense]);

  const validate = (): boolean => {
    const newErrors: { amount?: string; date?: string } = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (numAmount > 999999.99) {
      newErrors.amount = 'Amount cannot exceed $999,999.99';
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const numAmount = parseFloat(amount);
    onSave(numAmount, selectedCategory, date, note);
    onClose();
  };

  const handleDelete = () => {
    if (expense && onDelete) {
      onDelete(expense.id);
      onClose();
    }
  };

  const noteLength = note.length;
  const maxNoteLength = 200;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative z-50 w-full max-w-[450px] bg-white dark:bg-[#1A2633] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEditMode ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <div className="flex items-center gap-2">
              {isEditMode && onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-full p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Delete expense"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2">
            <div className="flex flex-col items-center justify-center py-6 mb-2">
              <div className="relative group">
                <div className="flex items-baseline justify-center gap-1 text-primary">
                  <span className="text-3xl font-bold opacity-70">$</span>
                  <input
                    autoFocus={!isEditMode}
                    className="block w-48 border-0 bg-transparent p-0 text-center text-6xl font-bold text-primary placeholder:text-primary/30 focus:ring-0"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors({ ...errors, amount: undefined });
                    }}
                    onBlur={() => validate()}
                    aria-label="Expense amount"
                  />
                </div>
                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2">Enter amount</p>
              {errors.amount && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Category
              </label>
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
                    aria-label={`Select ${cat.id} category`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold truncate w-full text-center ${
                        selectedCategory === cat.id
                          ? 'text-primary'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat.id.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    </div>
                    <input
                      className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 pl-10 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: undefined });
                      }}
                      onBlur={() => validate()}
                      aria-label="Expense date"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <div className="flex-[2]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Note
                    </label>
                    {noteLength > 0 && (
                      <span
                        className={`text-xs ${
                          noteLength > maxNoteLength
                            ? 'text-red-500'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {noteLength}/{maxNoteLength}
                      </span>
                    )}
                  </div>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Add a note (optional)..."
                    type="text"
                    maxLength={maxNoteLength}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    aria-label="Expense note"
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
                disabled={!amount || Object.keys(errors).length > 0}
                className="flex-[2] rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditMode ? 'Save Changes' : 'Save Expense'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-w-[400px] bg-white dark:bg-[#1A2633] rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Expense</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseModal;
