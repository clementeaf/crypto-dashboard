import { useState } from 'react';
import type { Cryptocurrency } from '~/types/crypto';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  index: number;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
}

export default function CryptoCard({
  crypto,
  index,
  isDragging,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver
}: CryptoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine color based on price change
  const priceChangeColor = (crypto.price_change_percentage_24h ?? 0) >= 0
    ? 'trend-up'
    : 'trend-down';
  
  // Format monetary values
  const formatCurrency = (value: number, isBtc = false) => {
    if (isBtc) {
      // For BTC values, show up to 8 decimals
      return value.toFixed(value < 0.0001 ? 8 : 6);
    }
    
    // For USD, format with thousands separators and 2 decimals for values greater than 1
    if (value >= 1) {
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(value);
    }
    
    // For small USD values, show more decimals
    const decimals = value < 0.0001 ? 8 : (value < 0.01 ? 6 : 4);
    return value.toFixed(decimals);
  };
  
  // Calculate formatted percentage
  const formattedPercentage = (crypto.price_change_percentage_24h ?? 0).toFixed(2);
  
  // Trend indicator
  const TrendIndicator = () => (
    <div className={`flex items-center ${priceChangeColor}`}>
      <span className="font-medium">
        {(crypto.price_change_percentage_24h ?? 0) >= 0 ? '↑' : '↓'} {formattedPercentage}%
      </span>
    </div>
  );
  
  // Rank badge
  const RankBadge = () => (
    <div className="absolute top-3 right-3">
      <span className="grok-badge grok-badge-secondary">
        #{(crypto as any).marketCapRank || index + 1}
      </span>
    </div>
  );
  
  return (
    <div
      className={`grok-card ${isHovered ? 'ring-1 ring-primary' : ''} ${isDragging ? 'opacity-70 scale-[1.02] z-10 shadow-lg' : ''}`}
      draggable={true}
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RankBadge />
      
      <div className="grok-card-content">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 mr-3 relative flex-shrink-0">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-full h-full object-contain rounded-full" 
            />
          </div>
          
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-lg truncate">{crypto.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground uppercase">{crypto.symbol}</span>
              <TrendIndicator />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Price (USD)</div>
            <div className="text-2xl font-bold">${formatCurrency(crypto.current_price.usd)}</div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Price (BTC)</div>
              <div className="text-sm">{formatCurrency(crypto.current_price.btc, true)} BTC</div>
            </div>
            
            <button 
              className={`btn ${isHovered ? 'btn-primary' : 'btn-secondary'} transition-all duration-300`}
            >
              Details
            </button>
          </div>
          
          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
              <div className="font-semibold">
                ${((crypto.market_cap ?? 0) / 1000000000).toFixed(2)}B
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">24h Vol</div>
              <div className="font-semibold">
                ${((crypto.total_volume ?? 0) / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 