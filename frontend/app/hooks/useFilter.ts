/**
 * Hook personalizado para la funcionalidad de filtrado
 */
import { useState, useCallback, useMemo } from 'react';
import type { Cryptocurrency } from '~/types/crypto';

interface UseFilterOptions {
  items: Cryptocurrency[];
}

interface UseFilterReturn {
  filteredItems: Cryptocurrency[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resetFilter: () => void;
}

/**
 * Hook para manejar la funcionalidad de filtrado de elementos
 */
export function useFilter({ items }: UseFilterOptions): UseFilterReturn {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Restablecer el filtro
  const resetFilter = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Calcular elementos filtrados basados en el término de búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return items.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(normalizedSearchTerm);
      const matchesSymbol = item.symbol.toLowerCase().includes(normalizedSearchTerm);
      
      return matchesName || matchesSymbol;
    });
  }, [items, searchTerm]);

  return {
    filteredItems,
    searchTerm,
    setSearchTerm,
    resetFilter,
  };
} 