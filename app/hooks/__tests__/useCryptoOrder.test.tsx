import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCryptoOrder } from '../useCryptoOrder';
import { getCardOrder, saveCardOrder } from '~/utils/storage';
import type { Cryptocurrency } from '~/types/crypto';

// Mock de las funciones de almacenamiento
vi.mock('~/utils/storage', () => ({
  getCardOrder: vi.fn(),
  saveCardOrder: vi.fn()
}));

describe('useCryptoOrder', () => {
  // Datos simplificados para las pruebas (solo con campos necesarios)
  const mockCryptos: Cryptocurrency[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: '', current_price: { usd: 1, btc: 1 } },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: '', current_price: { usd: 1, btc: 1 } },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', image: '', current_price: { usd: 1, btc: 1 } }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('maneja correctamente diferentes escenarios de orden', () => {
    // Escenario 1: Sin orden guardado
    (getCardOrder as any).mockReturnValue(null);
    const { result: result1 } = renderHook(() => useCryptoOrder(mockCryptos));
    
    // Verificar orden original
    expect(result1.current.orderedCryptos.map(c => c.id)).toEqual(['bitcoin', 'ethereum', 'cardano']);
    expect(getCardOrder).toHaveBeenCalledTimes(1);
    
    vi.clearAllMocks();
    
    // Escenario 2: Con orden personalizado
    (getCardOrder as any).mockReturnValue(['ethereum', 'cardano', 'bitcoin']);
    const { result: result2 } = renderHook(() => useCryptoOrder(mockCryptos));
    
    // Verificar orden personalizado
    expect(result2.current.orderedCryptos.map(c => c.id)).toEqual(['ethereum', 'cardano', 'bitcoin']);
    
    vi.clearAllMocks();
    
    // Escenario 3: Orden parcial
    (getCardOrder as any).mockReturnValue(['ethereum', 'bitcoin']);
    const { result: result3 } = renderHook(() => useCryptoOrder(mockCryptos));
    
    // Verificar orden parcial con nuevos al final
    expect(result3.current.orderedCryptos.map(c => c.id)).toEqual(['ethereum', 'bitcoin', 'cardano']);
    
    vi.clearAllMocks();
    
    // Escenario 4: Orden con IDs inexistentes
    (getCardOrder as any).mockReturnValue(['ethereum', 'nonexistent', 'bitcoin', 'anotherfake']);
    const { result: result4 } = renderHook(() => useCryptoOrder(mockCryptos));
    
    // Verificar que ignora IDs inexistentes
    expect(result4.current.orderedCryptos.map(c => c.id)).toEqual(['ethereum', 'bitcoin', 'cardano']);
  });

  test('actualiza el orden y guarda en localStorage', () => {
    // Configurar mock
    (getCardOrder as any).mockReturnValue(null);
    
    // Renderizar hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));
    
    // Actualizar orden
    const newOrder = ['cardano', 'ethereum', 'bitcoin'];
    act(() => {
      result.current.updateOrder(newOrder);
    });
    
    // Verificar nuevo orden y llamada a saveCardOrder
    expect(result.current.orderedCryptos.map(c => c.id)).toEqual(newOrder);
    expect(saveCardOrder).toHaveBeenCalledWith(newOrder);
  });

  test('maneja casos extremos - array vacío y cambios en las criptomonedas', () => {
    // Caso vacío
    const { result: emptyResult } = renderHook(() => useCryptoOrder([]));
    expect(emptyResult.current.orderedCryptos).toHaveLength(0);
    
    // Caso con cambios en las criptomonedas
    (getCardOrder as any).mockReturnValue(['ethereum', 'bitcoin']);
    
    // Usar una versión más ligera para pruebas de rerender
    const { result, rerender } = renderHook(
      (props) => useCryptoOrder(props),
      { initialProps: mockCryptos }
    );
    
    // Verificar orden inicial
    expect(result.current.orderedCryptos.map(c => c.id)).toEqual(['ethereum', 'bitcoin', 'cardano']);
    
    // Añadir nuevo elemento
    const newCrypto = { id: 'solana', name: 'Solana', symbol: 'sol', image: '', current_price: { usd: 1, btc: 1 } };
    rerender([...mockCryptos, newCrypto]);
    
    // Verificar que mantiene orden y añade nuevo al final
    expect(result.current.orderedCryptos.map(c => c.id)).toEqual(['ethereum', 'bitcoin', 'cardano', 'solana']);
  });
}); 