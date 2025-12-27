import React, { useMemo } from "react";
import { Expense, Category } from "../types";
import { getCurrentMonthShort } from "../utils/dateFormatter";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";

interface DashboardProps {
  expenses: Expense[];
  onAddExpense: () => void;
  userName?: string;
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  onAddExpense,
  userName = "Alex",
  isLoading = false,
}) => {
  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );
  const budgetLimit = 600;
  const budgetPercentage = Math.min(
    Math.round((totalSpent / budgetLimit) * 100),
    100
  );
  const remaining = Math.max(budgetLimit - totalSpent, 0);

  const topSpending = useMemo(() => {
    const categories: Record<Category, number> = {} as any;
    expenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [expenses]);

  const categoryIcons: Record<
    string,
    { icon: string; bg: string; text: string }
  > = {
    [Category.FOOD]: {
      icon: "restaurant",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
    },
    [Category.TEXTBOOKS]: {
      icon: "menu_book",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    [Category.TRANSPORT]: {
      icon: "directions_bus",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    [Category.ENTERTAINMENT]: {
      icon: "sports_esports",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
    },
    [Category.RENT]: {
      icon: "home",
      bg: "bg-gray-100 dark:bg-gray-700/30",
      text: "text-gray-600 dark:text-gray-400",
    },
    [Category.INTERNET]: {
      icon: "wifi",
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-600 dark:text-sky-400",
    },
    [Category.OTHER]: {
      icon: "sell",
      bg: "bg-slate-100 dark:bg-slate-700/30",
      text: "text-slate-600 dark:text-slate-400",
    },
  };

  return (
    <div className="max-w-[960px] mx-auto p-6 md:p-12 flex flex-col gap-8 pb-24">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Hi, {userName.split(" ")[0]}
          </p>
          <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
            Welcome back to your dashboard
          </p>
        </div>
        <div className="bg-white dark:bg-[#1A2633] border border-[#dbe0e6] dark:border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[#617589] dark:text-gray-400 text-[20px]">
            calendar_month
          </span>
          <p className="text-[#111418] dark:text-white font-medium text-sm">
            {getCurrentMonthShort()}
          </p>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-[#1A2633] rounded-xl p-8 border border-[#dbe0e6] dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex flex-col gap-2 z-10">
          <p className="text-[#617589] dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
            Total spent this month
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-primary text-5xl md:text-6xl font-black tracking-tight leading-none">
              ${totalSpent.toFixed(2)}
            </h2>
          </div>
          <p className="text-[#617589] dark:text-gray-400 text-base font-medium leading-normal mt-1">
            Across all categories
          </p>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px] z-10">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-[#111418] dark:text-white">Budget limit</span>
            <span className="text-[#617589] dark:text-gray-400">
              {budgetPercentage}%
            </span>
          </div>
          <div className="h-3 w-full bg-[#f0f2f4] dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#617589] dark:text-gray-500 text-right">
            ${remaining.toFixed(2)} remaining
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          icon="wallet"
          title="No expenses yet"
          message="Start tracking today to see your spending summary and category breakdown here."
          actionLabel="Add Your First Expense"
          onAction={onAddExpense}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-2">
              Top Spending
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {topSpending.map((item) => {
              const styles =
                categoryIcons[item.name] || categoryIcons[Category.OTHER];
              const percent =
                totalSpent > 0
                  ? Math.round((item.amount / totalSpent) * 100)
                  : 0;
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-4 bg-white dark:bg-[#1A2633] p-4 rounded-xl border border-[#dbe0e6] dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div
                    className={`flex items-center justify-center rounded-lg ${styles.bg} ${styles.text} shrink-0 size-12`}
                  >
                    <span className="material-symbols-outlined">
                      {styles.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[#111418] dark:text-white text-base font-bold truncate">
                        {item.name}
                      </p>
                      <p className="text-[#111418] dark:text-white text-base font-bold">
                        ${item.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-full bg-[#f0f2f4] dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: styles.text.includes("orange")
                            ? "#f97316"
                            : styles.text.includes("blue")
                            ? "#3b82f6"
                            : styles.text.includes("emerald")
                            ? "#10b981"
                            : styles.text.includes("purple")
                            ? "#a855f7"
                            : "#94a3b8",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
