import { useState, useEffect } from 'react';
import { useNavigation } from '@remix-run/react';
import CryptoCard from '~/components/cards/CryptoCard';
import SearchFilter from '~/components/ui/SearchFilter';
import ThemeToggle from '~/components/ui/ThemeToggle';
import type { Cryptocurrency } from '~/types/crypto';
import { useDragSort } from '~/hooks/useDragSort';
import { useFilter } from '~/hooks/useFilter';
import { getTimeSinceLastRefresh, setLastRefreshTime } from '~/utils/storage';

interface DashboardProps {
  cryptocurrencies: Cryptocurrency[];
  onRefresh: () => void;
  error?: string | null;
}

export default function Dashboard({ cryptocurrencies, onRefresh, error }: DashboardProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const [timeSinceRefresh, setTimeSinceRefresh] = useState<number | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  
  // Hook to handle drag and drop
  const { 
    items, 
    draggedItemIndex, 
    handleDragStart, 
    handleDragEnter, 
    handleDragEnd, 
    handleDragOver 
  } = useDragSort({ initialItems: cryptocurrencies });
  
  // Hook to handle filtering
  const { 
    filteredItems, 
    searchTerm, 
    setSearchTerm,
  } = useFilter({ items });

  // Update time since last refresh every second
  useEffect(() => {
    if (isLoading) return;
    
    const updateTimeSinceRefresh = () => {
      const time = getTimeSinceLastRefresh();
      setTimeSinceRefresh(time);
    };
    
    // Run immediately
    updateTimeSinceRefresh();
    
    // Update every second
    const interval = setInterval(updateTimeSinceRefresh, 1000);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  // Auto-refresh every 60 seconds if enabled
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;
    
    const interval = setInterval(() => {
      onRefresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, onRefresh]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    onRefresh();
    setLastRefreshTime();
  };
  
  // Format time since last refresh
  const formatTimeSinceRefresh = () => {
    if (timeSinceRefresh === null) return 'N/A';
    
    if (timeSinceRefresh < 60) {
      return `${timeSinceRefresh} seconds`;
    }
    
    const minutes = Math.floor(timeSinceRefresh / 60);
    const seconds = timeSinceRefresh % 60;
    
    if (minutes < 60) {
      return `${minutes}m ${seconds}s`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  return (
    <div className="grok-container">
      <div className="grok-header">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor top cryptocurrencies in real-time
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="text-sm text-muted-foreground">
            Updated: <span className="font-semibold">{formatTimeSinceRefresh()} ago</span>
          </div>
          
          <button 
            className={`btn btn-primary flex items-center ${isLoading ? 'opacity-80' : ''}`} 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isAutoRefreshEnabled}
                onChange={(e) => setIsAutoRefreshEnabled(e.target.checked)}
              />
              <div className={`block w-10 h-5 rounded-full transition-colors duration-200 ${isAutoRefreshEnabled ? 'bg-primary' : 'bg-secondary'}`}></div>
              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform ${isAutoRefreshEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm">Auto</span>
          </label>
        </div>
      </div>
      
      <div className="w-full max-w-md mb-8">
        <SearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          isLoading={isLoading}
        />
      </div>
      
      {error ? (
        <div className="rounded-lg p-4 mb-6 bg-destructive/10 text-destructive border border-destructive/20">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Cryptocurrencies</h2>
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {items.length} cryptocurrencies
            </div>
          </div>
          
          {isLoading && filteredItems.length === 0 ? (
            <div className="grok-card-grid animate-pulse">
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="grok-card h-64"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary rounded w-4/5"></div>
                        <div className="h-3 bg-secondary rounded w-3/5"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-secondary rounded"></div>
                      <div className="h-4 bg-secondary rounded"></div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-3 bg-secondary rounded w-1/2"></div>
                          <div className="h-4 bg-secondary rounded w-3/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-secondary rounded w-1/2"></div>
                          <div className="h-4 bg-secondary rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-border">
              <div className="max-w-md mx-auto space-y-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto text-muted-foreground opacity-50" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <p className="text-muted-foreground">
                  No cryptocurrencies found matching <span className="font-semibold">"{searchTerm}"</span>
                </p>
                <button 
                  className="btn btn-secondary mt-4" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <div className="grok-card-grid">
              {filteredItems.map((crypto, index) => (
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  index={index}
                  isDragging={index === draggedItemIndex}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 