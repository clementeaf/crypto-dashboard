import { useState } from 'react';
import type { Cryptocurrency } from '~/types/crypto';
import { formatUsdPrice, formatBtcPrice } from '~/utils/utils';

interface CryptoCardGridProps {
  cryptos: Cryptocurrency[];
  onOrderChange?: (newOrder: string[]) => void;
}

export default function CryptoCardGrid({ cryptos, onOrderChange }: CryptoCardGridProps) {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
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
    
    // Notify about order change
    if (onOrderChange) {
      onOrderChange(newCryptos.map(crypto => crypto.id));
    }
    
    // Update the dragged item index
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  if (cryptos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No cryptocurrencies found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {cryptos.map((crypto, index) => (
        <div
          key={crypto.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          className={`transition-all duration-300 transform hover:-translate-y-1 ${
            index === draggedItemIndex ? 'opacity-50 scale-105' : 'opacity-100'
          }`}
        >
          <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg overflow-hidden hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/10">
            <div className="absolute top-0 left-0 w-full h-1">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </div>
            <div className="p-3 sm:p-5">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="mr-2 sm:mr-3">
                  <img src={crypto.image} alt={crypto.symbol} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{crypto.name}</h3>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{crypto.symbol.toUpperCase()}</span>
                </div>
                <div className="ml-auto">
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                    #{index + 1}
                  </span>
                </div>
              </div>

              <div className="mb-3 sm:mb-4">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  ${formatUsdPrice(crypto.current_price.usd)}
                </h4>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700/30">
                <div className="grid grid-cols-1 gap-y-2 sm:gap-y-3">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Price (BTC)
                    </div>
                    <div className="text-sm sm:font-medium text-gray-700 dark:text-gray-300">
                      {formatBtcPrice(crypto.current_price.btc)} BTC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 