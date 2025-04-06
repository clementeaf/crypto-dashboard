import { memo } from 'react';

type CryptoCardSkeletonProps = {
  count?: number;
};

const CryptoCardSkeleton = memo(function CryptoCardSkeleton({ count = 8 }: CryptoCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="p-5 space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="ml-auto">
                <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default CryptoCardSkeleton; 