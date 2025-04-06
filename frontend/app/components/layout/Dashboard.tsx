import { useEffect, useCallback } from 'react';
import { useNavigation } from '@remix-run/react';
import { setLastRefreshTime } from '~/utils/storage';
import { DashboardProps } from '~/types/types';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import DashboardFooter from './DashboardFooter';
import ErrorMessage from '../ui/ErrorMessage';
import CryptoSkeletonLoader from '../ui/CryptoSkeletonLoader';
import CryptoCardGrid from '../cards/CryptoCardGrid';
import { useCryptoOrder } from '~/hooks/useCryptoOrder';
import { useFilteredCryptos } from '~/hooks/useFilteredCryptos';

export default function Dashboard({ 
  cryptocurrencies, 
  onRefresh, 
  apiError,
  title = "Crypto Dashboard",
  username = "Usuario",
  onLogout,
  lastUpdated = null,
  autoRefresh = false,
  onToggleAutoRefresh,
  refreshInterval = 60,
  onChangeRefreshInterval
}: DashboardProps) {
  // Get loading state from Remix navigation
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  // Use custom hooks
  const { orderedCryptos, updateOrder } = useCryptoOrder(cryptocurrencies);
  const { searchTerm, setSearchTerm, filteredCryptos } = useFilteredCryptos(orderedCryptos);
  
  // Handle manual refresh with time tracking
  const handleRefresh = useCallback(() => {
    onRefresh();
    setLastRefreshTime();
  }, [onRefresh]);
  
  // Set up the auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);
  
  // Handle card reordering
  const handleCardOrderChange = useCallback((newOrder: string[]) => {
    updateOrder(newOrder);
  }, [updateOrder]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <DashboardHeader
        title={title}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onLogout={onLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats Panel */}
        <DashboardStats 
          username={username}
          totalCoins={cryptocurrencies.length}
          filteredCoins={filteredCryptos.length}
          autoRefresh={autoRefresh}
          refreshInterval={refreshInterval}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleAutoRefresh={onToggleAutoRefresh || (() => {})}
          onChangeRefreshInterval={onChangeRefreshInterval || (() => {})}
        />
        
        {/* Error messages */}
        {apiError && (
          <ErrorMessage 
            message={apiError}
            description="The data shown may not be accurate. Try refreshing in a few minutes."
          />
        )}
        
        {/* Cryptocurrencies section header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Cryptocurrencies</h2>
          
          <div className="flex items-center gap-2">
            {filteredCryptos.length === 0 && searchTerm.trim() !== '' && (
              <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                No results found
              </span>
            )}
          </div>
        </div>
        
        {/* Cryptocurrencies grid or skeleton loader */}
        {isLoading && filteredCryptos.length === 0 ? (
          <CryptoSkeletonLoader count={8} />
        ) : (
          <CryptoCardGrid 
            cryptos={filteredCryptos} 
            onOrderChange={handleCardOrderChange}
          />
        )}
      </main>
      
      {/* Footer */}
      <DashboardFooter lastUpdated={lastUpdated} />
    </div>
  );
} 