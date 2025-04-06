import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Cryptocurrency } from '~/types/crypto';
import { getCardOrder, saveCardOrder } from '~/utils/storage';

export function useCryptoOrder(cryptocurrencies: Cryptocurrency[]) {
  const [orderedCryptos, setOrderedCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  
  // Función para ordenar criptomonedas según un orden guardado
  const sortCryptocurrencies = useCallback((cryptos: Cryptocurrency[], savedOrder: string[] | null) => {
    if (cryptos.length === 0) {
      return [];
    }
    
    if (!savedOrder || savedOrder.length === 0) {
      return [...cryptos];
    }
    
    // Creamos un mapa para acceso rápido a las criptomonedas por id
    const cryptoMap = new Map<string, Cryptocurrency>();
    cryptos.forEach(crypto => cryptoMap.set(crypto.id, crypto));
    
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
    
    return orderedCryptos;
  }, []);
  
  // Load saved order when cryptocurrencies change
  useEffect(() => {
    // Intentamos obtener el orden guardado de localStorage
    const savedOrder = getCardOrder();
    const sorted = sortCryptocurrencies(cryptocurrencies, savedOrder);
    setOrderedCryptos(sorted);
  }, [cryptocurrencies, sortCryptocurrencies]);
  
  // Handler to update the order
  const updateOrder = useCallback((newOrder: string[]) => {
    // Save the new order to localStorage
    saveCardOrder(newOrder);
    
    // Apply the order to the current cryptos
    if (newOrder.length > 0 && cryptocurrencies.length > 0) {
      setOrderedCryptos(sortCryptocurrencies(cryptocurrencies, newOrder));
    }
  }, [cryptocurrencies, sortCryptocurrencies]);
  
  // Memoizar el valor de retorno para evitar renderizados innecesarios
  return useMemo(() => ({
    orderedCryptos,
    updateOrder
  }), [orderedCryptos, updateOrder]);
} 