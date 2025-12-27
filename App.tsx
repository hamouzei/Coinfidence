import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ExpenseModal from "./components/ExpenseModal";
import Toast, { ToastType } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import { Expense, Category, User } from "./types";
import { authHelpers, supabase } from "./services/supabase";
import { expenseService } from "./services/expenseService";
import { userSettingsService } from "./services/userSettingsService";

interface ToastState {
  message: string;
  type: ToastType;
}

const AppContent: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(600);
  const location = useLocation();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session, error } = await authHelpers.getSession();
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const supabaseUser = session.user;
          const newUser = {
            email: supabaseUser.email || "",
            name:
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split("@")[0] ||
              "User",
            plan: "Student Plan",
            avatar:
              supabaseUser.user_metadata?.avatar_url ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(supabaseUser.email?.split("@")[0] || "User"),
          };
          setUser(newUser);
          // Fetch expenses and settings for logged-in user
          // Load settings first, then expenses
          const loadData = async () => {
            try {
              const settings = await userSettingsService.getSettings();
              setMonthlyBudget(settings.monthly_budget);
              setUser({ ...newUser, monthlyBudget: settings.monthly_budget });
            } catch (error: any) {
              console.error("Error loading user settings:", error);
              setMonthlyBudget(600);
              setUser({ ...newUser, monthlyBudget: 600 });
            }
            // Load expenses after settings
            loadExpenses();
          };
          loadData();
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = authHelpers.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const supabaseUser = session.user;
        const newUser = {
          email: supabaseUser.email || "",
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "User",
          plan: "Student Plan",
          avatar:
            supabaseUser.user_metadata?.avatar_url ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(supabaseUser.email?.split("@")[0] || "User"),
        };
        setUser(newUser);
        // Fetch settings first, then expenses
        const loadData = async () => {
          try {
            const settings = await userSettingsService.getSettings();
            setMonthlyBudget(settings.monthly_budget);
            setUser({ ...newUser, monthlyBudget: settings.monthly_budget });
          } catch (error: any) {
            console.error("Error loading user settings:", error);
            setMonthlyBudget(600);
            setUser({ ...newUser, monthlyBudget: 600 });
          }
          loadExpenses();
        };
        loadData();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setExpenses([]); // Clear expenses on logout
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Session refreshed, user still logged in
        const supabaseUser = session.user;
        setUser({
          email: supabaseUser.email || "",
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "User",
          plan: "Student Plan",
          avatar:
            supabaseUser.user_metadata?.avatar_url ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(supabaseUser.email?.split("@")[0] || "User"),
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!user) return; // Only enable shortcuts when logged in
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open add expense modal (when not in input/textarea)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isModalOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          openAddModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, user]);

  // Load user settings (budget)
  const loadUserSettings = async () => {
    try {
      const settings = await userSettingsService.getSettings();
      console.log('✅ Loaded user settings:', settings);
      setMonthlyBudget(settings.monthly_budget);
      if (user) {
        setUser({ ...user, monthlyBudget: settings.monthly_budget });
      }
    } catch (error: any) {
      console.error("❌ Error loading user settings:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      // Use default budget if settings can't be loaded
      setMonthlyBudget(600);
      if (user) {
        setUser({ ...user, monthlyBudget: 600 });
      }
    }
  };

  // Load expenses from Supabase
  const loadExpenses = async () => {
    // Check if user is authenticated (don't rely on user state)
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      console.log('⚠️ Cannot load expenses: user not authenticated');
      return;
    }
    
    setIsLoadingExpenses(true);
    try {
      console.log('🔄 Loading expenses...');
      const fetchedExpenses = await expenseService.fetchExpenses();
      console.log(`✅ Loaded ${fetchedExpenses.length} expenses:`, fetchedExpenses);
      setExpenses(fetchedExpenses);
    } catch (error: any) {
      console.error("❌ Error loading expenses:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Check if expenses table exists
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        showToast(
          "Expenses table not found. Please run database/schema.sql in Supabase.",
          "error"
        );
      } else {
        showToast(
          error.message || "Failed to load expenses. Please try again.",
          "error"
        );
      }
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleAddExpense = async (
    amount: number,
    category: Category,
    date: string,
    note: string
  ) => {
    try {
      const newExpense = await expenseService.addExpense(
        amount,
        category,
        date,
        note
      );
      setExpenses((prev) => [newExpense, ...prev]);
      showToast("Expense added successfully", "success");
    } catch (error: any) {
      console.error("Error adding expense:", error);
      showToast(
        error.message || "Failed to add expense. Please try again.",
        "error"
      );
    }
  };

  const handleEditExpense = async (
    amount: number,
    category: Category,
    date: string,
    note: string
  ) => {
    if (!editingExpense) return;

    try {
      const updatedExpense = await expenseService.updateExpense(
        editingExpense.id,
        amount,
        category,
        date,
        note
      );
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === editingExpense.id ? updatedExpense : exp))
      );
      showToast("Expense updated successfully", "success");
      setEditingExpense(null);
    } catch (error: any) {
      console.error("Error updating expense:", error);
      showToast(
        error.message || "Failed to update expense. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      showToast("Expense deleted successfully", "success");
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      showToast(
        error.message || "Failed to delete expense. Please try again.",
        "error"
      );
    }
  };

  const handleLogin = async (userData: {
    email: string;
    name: string;
    id: string;
  }) => {
    setUser({
      email: userData.email,
      name: userData.name,
      plan: "Student Plan",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}`,
    });
    showToast("Welcome back!", "success");
    // Load settings first, then expenses
    const loadData = async () => {
      try {
        const settings = await userSettingsService.getSettings();
        setMonthlyBudget(settings.monthly_budget);
        setUser({ ...user, monthlyBudget: settings.monthly_budget });
      } catch (error: any) {
        console.error("Error loading user settings:", error);
        setMonthlyBudget(600);
        setUser({ ...user, monthlyBudget: 600 });
      }
      loadExpenses();
    };
    loadData();
  };

  const handleLogout = async () => {
    const { error } = await authHelpers.signOut();
    if (error) {
      showToast("Error logging out. Please try again.", "error");
    } else {
      setUser(null);
      showToast("Logged out successfully", "success");
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show auth screens if not logged in
  if (!user) {
    return (
      <>
        <Routes>
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  const isHistory = location.pathname === "/history";
  const isProfile = location.pathname === "/profile";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1A2633] border-b border-[#dbe0e6] dark:border-gray-800 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg dark:text-white">Coinfidence</h1>
          </div>
          <button className="text-[#111418] dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  expenses={expenses}
                  onAddExpense={openAddModal}
                  userName={user.name}
                  isLoading={isLoadingExpenses}
                  monthlyBudget={monthlyBudget}
                />
              }
            />
            <Route
              path="/history"
              element={
                <History
                  expenses={expenses}
                  onAddExpense={openAddModal}
                  onEditExpense={openEditModal}
                  onDeleteExpense={handleDeleteExpense}
                  isLoading={isLoadingExpenses}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  onLogout={handleLogout}
                  onBudgetUpdate={(budget) => {
                    setMonthlyBudget(budget);
                    setUser({ ...user, monthlyBudget: budget });
                    showToast("Budget updated successfully", "success");
                  }}
                />
              }
            />
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
            <Link
              to="/"
              className="flex flex-col items-center justify-center gap-1 w-16 group"
            >
              <span
                className={`material-symbols-outlined text-[26px] ${
                  location.pathname === "/"
                    ? "text-primary icon-filled"
                    : "text-gray-400"
                }`}
              >
                home
              </span>
              <span
                className={`text-[10px] font-medium ${
                  location.pathname === "/" ? "text-primary" : "text-gray-400"
                }`}
              >
                Home
              </span>
            </Link>
            <Link
              to="/history"
              className="flex flex-col items-center justify-center gap-1 w-16 group"
            >
              <span
                className={`material-symbols-outlined text-[26px] ${
                  location.pathname === "/history"
                    ? "text-primary icon-filled"
                    : "text-gray-400"
                }`}
              >
                receipt_long
              </span>
              <span
                className={`text-[10px] font-medium ${
                  location.pathname === "/history"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                Expenses
              </span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center gap-1 w-16 group"
            >
              <span
                className={`material-symbols-outlined text-[26px] ${
                  location.pathname === "/profile"
                    ? "text-primary icon-filled"
                    : "text-gray-400"
                }`}
              >
                person
              </span>
              <span
                className={`text-[10px] font-medium ${
                  location.pathname === "/profile"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                Profile
              </span>
            </Link>
          </nav>
        </div>
      </main>

      {isModalOpen && (
        <ExpenseModal
          onClose={closeModal}
          onSave={editingExpense ? handleEditExpense : handleAddExpense}
          onDelete={handleDeleteExpense}
          expense={editingExpense}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
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
