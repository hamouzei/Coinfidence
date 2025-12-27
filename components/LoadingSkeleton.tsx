import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-[#dbe0e6] dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  const SkeletonText = () => (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
    </div>
  );

  if (type === 'list') {
    return <SkeletonList />;
  }

  if (type === 'text') {
    return <SkeletonText />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;

