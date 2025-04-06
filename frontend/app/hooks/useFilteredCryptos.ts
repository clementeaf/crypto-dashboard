import { useState, useEffect } from 'react';
import type { Cryptocurrency } from '~/types/crypto';

export function useFilteredCryptos(cryptocurrencies: Cryptocurrency[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  
  // Filter cryptocurrencies based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCryptos(cryptocurrencies);
      return;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = cryptocurrencies.filter(crypto => 
      crypto.name.toLowerCase().includes(normalizedSearchTerm) || 
      crypto.symbol.toLowerCase().includes(normalizedSearchTerm)
    );
    
    setFilteredCryptos(filtered);
  }, [cryptocurrencies, searchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    filteredCryptos
  };
} 