import { useState, useEffect, useCallback } from 'react';
import type { Cryptocurrency } from '~/types/crypto';
import { getCardOrder, saveCardOrder } from '~/utils/storage';

export function useCryptoOrder(cryptocurrencies: Cryptocurrency[]) {
  const [orderedCryptos, setOrderedCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  
  // Load saved order when cryptocurrencies change
  useEffect(() => {
    // Solo intentamos ordenar si hay criptomonedas
    if (cryptocurrencies.length === 0) {
      setOrderedCryptos([]);
      return;
    }
    
    // Intentamos obtener el orden guardado de localStorage
    const savedOrder = getCardOrder();
    
    if (savedOrder && savedOrder.length > 0) {
      // Creamos un mapa para acceso rápido a las criptomonedas por id
      const cryptoMap = new Map<string, Cryptocurrency>();
      cryptocurrencies.forEach(crypto => cryptoMap.set(crypto.id, crypto));
      
      // Creamos un nuevo array ordenado basado en los IDs guardados
      const orderedCryptos: Cryptocurrency[] = [];
      
      // Primero agregamos las criptomonedas que tienen un orden guardado
      savedOrder.forEach(id => {
        const crypto = cryptoMap.get(id);
        if (crypto) {
          orderedCryptos.push(crypto);
          cryptoMap.delete(id);
        }
      });
      
      // Luego agregamos cualquier criptomoneda nueva que no estaba en el orden guardado
      cryptoMap.forEach(crypto => {
        orderedCryptos.push(crypto);
      });
      
      setOrderedCryptos(orderedCryptos);
    } else {
      // Si no hay orden guardado, usamos el orden predeterminado
      setOrderedCryptos(cryptocurrencies);
    }
  }, [cryptocurrencies]);
  
  // Handler to update the order
  const updateOrder = useCallback((newOrder: string[]) => {
    // Save the new order to localStorage
    saveCardOrder(newOrder);
    
    // Apply the order to the current cryptos
    if (newOrder.length > 0 && cryptocurrencies.length > 0) {
      const cryptoMap = new Map<string, Cryptocurrency>();
      cryptocurrencies.forEach(crypto => cryptoMap.set(crypto.id, crypto));
      
      // Reorder cryptos based on newOrder
      const reorderedCryptos: Cryptocurrency[] = [];
      
      // First add cryptos that are in the new order
      newOrder.forEach(id => {
        const crypto = cryptoMap.get(id);
        if (crypto) {
          reorderedCryptos.push(crypto);
          cryptoMap.delete(id);
        }
      });
      
      // Then add any remaining cryptos
      cryptoMap.forEach(crypto => {
        reorderedCryptos.push(crypto);
      });
      
      setOrderedCryptos(reorderedCryptos);
    }
  }, [cryptocurrencies]);
  
  return {
    orderedCryptos,
    updateOrder
  };
} 