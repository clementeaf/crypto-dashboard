import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@remix-run/react';
import CryptoCard from '~/components/cards/CryptoCard';
import SearchFilter from '~/components/ui/SearchFilter';
import ThemeToggle from '~/components/ui/ThemeToggle';
import type { Cryptocurrency } from '~/types/crypto';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
  // Update cryptos when cryptocurrencies prop changes
  useEffect(() => {
    setCryptos(cryptocurrencies);
  }, [cryptocurrencies]);
  
  // Filter cryptocurrencies based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCryptos(cryptos);
      return;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(normalizedSearchTerm) || 
      crypto.symbol.toLowerCase().includes(normalizedSearchTerm)
    );
    
    setFilteredCryptos(filtered);
  }, [cryptos, searchTerm]);
  
  // Format time since last refresh
  const formatTimeSinceRefresh = () => {
    if (timeSinceRefresh === null) return 'N/A';
    
    if (timeSinceRefresh < 60) {
      return `${timeSinceRefresh}s`;
    }
    
    const minutes = Math.floor(timeSinceRefresh / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };
  
  // Update time since last refresh
  useEffect(() => {
    if (isLoading) return;
    
    const updateTime = () => {
      const time = getTimeSinceLastRefresh();
      setTimeSinceRefresh(time);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  // Handle auto-refresh
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;
    
    const interval = setInterval(() => {
      onRefresh();
      setLastRefreshTime();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, onRefresh]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    onRefresh();
    setLastRefreshTime();
  }, [onRefresh]);
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Create a copy of the current crypto list
    const newCryptos = [...cryptos];
    
    // Get the item that is being dragged
    const draggedItem = newCryptos[draggedItemIndex];
    
    // Remove it from the array
    newCryptos.splice(draggedItemIndex, 1);
    
    // Add it at the new position
    newCryptos.splice(index, 0, draggedItem);
    
    // Update the state with the new array
    setCryptos(newCryptos);
    
    // Update the dragged item index
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Crypto Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor top cryptocurrencies in real-time
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="w-full max-w-md mb-6">
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
        />
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800/30">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cryptocurrencies</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCryptos.length} of {cryptocurrencies.length} cryptocurrencies
        </div>
      </div>
      
      {isLoading && filteredCryptos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-64 animate-pulse"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCryptos.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto space-y-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-gray-400" 
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
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron criptomonedas con <span className="font-semibold">"{searchTerm}"</span>
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCryptos.map((crypto, index) => (
            <CryptoCard
              key={crypto.id + '-' + index}
              crypto={crypto}
              index={index}
              isDragging={draggedItemIndex === index}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      )}
    </div>
  );
} 