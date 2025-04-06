import { useState, useCallback, useMemo } from 'react';
import type { Cryptocurrency } from '~/types/crypto';

export function useFilteredCryptos(cryptocurrencies: Cryptocurrency[]) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Función para restablecer el filtro
  const resetFilter = useCallback(() => {
    setSearchTerm('');
  }, []);
  
  // Filtrar criptomonedas basado en término de búsqueda usando useMemo en lugar de useEffect
  const filteredCryptos = useMemo(() => {
    if (!searchTerm.trim()) {
      return cryptocurrencies;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return cryptocurrencies.filter(crypto => 
      crypto.name.toLowerCase().includes(normalizedSearchTerm) || 
      crypto.symbol.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [cryptocurrencies, searchTerm]);
  
  // Memoizar el objeto de retorno para evitar renderizados innecesarios
  return useMemo(() => ({
    searchTerm,
    setSearchTerm,
    filteredCryptos,
    resetFilter
  }), [searchTerm, filteredCryptos, resetFilter]);
} 