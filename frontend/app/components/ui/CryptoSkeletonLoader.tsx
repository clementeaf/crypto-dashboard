import { memo } from 'react';
import type { CryptoCardSkeletonProps } from '~/types/types';

const CryptoSkeletonLoader = memo(function CryptoSkeletonLoader({ count = 8 }: CryptoCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg overflow-hidden h-56 sm:h-64 animate-pulse"
        >
          <div className="p-3 sm:p-5 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 dark:bg-gray-700/50 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-4/5"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-3/5"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
            </div>
            <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default CryptoSkeletonLoader; 