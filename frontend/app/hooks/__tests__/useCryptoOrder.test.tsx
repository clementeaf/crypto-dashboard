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
  // Datos de muestra para las pruebas
  const mockCryptos: Cryptocurrency[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: 'https://example.com/bitcoin.png',
      current_price: {
        usd: 50000,
        btc: 1
      }
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'eth',
      image: 'https://example.com/ethereum.png',
      current_price: {
        usd: 3000,
        btc: 0.06
      }
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ada',
      image: 'https://example.com/cardano.png',
      current_price: {
        usd: 1.2,
        btc: 0.00002
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('devuelve las criptomonedas en el orden original cuando no hay orden guardado', () => {
    // Configurar el mock para devolver null (sin orden guardado)
    (getCardOrder as any).mockReturnValue(null);

    // Renderizar el hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));

    // Verificar que las criptomonedas están en el orden original
    expect(result.current.orderedCryptos).toHaveLength(3);
    expect(result.current.orderedCryptos[0].id).toBe('bitcoin');
    expect(result.current.orderedCryptos[1].id).toBe('ethereum');
    expect(result.current.orderedCryptos[2].id).toBe('cardano');
    
    // Verificar que se intentó cargar el orden
    expect(getCardOrder).toHaveBeenCalledTimes(1);
  });

  test('ordena las criptomonedas según el orden guardado', () => {
    // Configurar el mock para devolver un orden personalizado
    (getCardOrder as any).mockReturnValue(['ethereum', 'cardano', 'bitcoin']);

    // Renderizar el hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));

    // Verificar que las criptomonedas están en el orden guardado
    expect(result.current.orderedCryptos).toHaveLength(3);
    expect(result.current.orderedCryptos[0].id).toBe('ethereum');
    expect(result.current.orderedCryptos[1].id).toBe('cardano');
    expect(result.current.orderedCryptos[2].id).toBe('bitcoin');
    
    // Verificar que se intentó cargar el orden
    expect(getCardOrder).toHaveBeenCalledTimes(1);
  });

  test('incluye nuevas criptomonedas al final cuando no están en el orden guardado', () => {
    // Configurar el mock para devolver un orden que no incluye todas las criptomonedas
    (getCardOrder as any).mockReturnValue(['ethereum', 'bitcoin']);

    // Renderizar el hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));

    // Verificar que las criptomonedas están en el orden guardado y las nuevas al final
    expect(result.current.orderedCryptos).toHaveLength(3);
    expect(result.current.orderedCryptos[0].id).toBe('ethereum');
    expect(result.current.orderedCryptos[1].id).toBe('bitcoin');
    expect(result.current.orderedCryptos[2].id).toBe('cardano');
  });

  test('ignora IDs en el orden guardado que no existen en las criptomonedas actuales', () => {
    // Configurar el mock para devolver un orden con IDs que no existen
    (getCardOrder as any).mockReturnValue(['ethereum', 'nonexistent', 'bitcoin', 'anotherfake']);

    // Renderizar el hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));

    // Verificar que solo las criptomonedas existentes están ordenadas
    expect(result.current.orderedCryptos).toHaveLength(3);
    expect(result.current.orderedCryptos[0].id).toBe('ethereum');
    expect(result.current.orderedCryptos[1].id).toBe('bitcoin');
    expect(result.current.orderedCryptos[2].id).toBe('cardano');
  });

  test('actualiza el orden cuando se llama a updateOrder', () => {
    // Configurar el mock para devolver null inicialmente
    (getCardOrder as any).mockReturnValue(null);

    // Renderizar el hook
    const { result } = renderHook(() => useCryptoOrder(mockCryptos));

    // Verificar el orden inicial
    expect(result.current.orderedCryptos[0].id).toBe('bitcoin');

    // Actualizar el orden
    const newOrder = ['cardano', 'ethereum', 'bitcoin'];
    act(() => {
      result.current.updateOrder(newOrder);
    });

    // Verificar que el orden se ha actualizado
    expect(result.current.orderedCryptos[0].id).toBe('cardano');
    expect(result.current.orderedCryptos[1].id).toBe('ethereum');
    expect(result.current.orderedCryptos[2].id).toBe('bitcoin');
    
    // Verificar que se guardó el nuevo orden
    expect(saveCardOrder).toHaveBeenCalledWith(newOrder);
  });

  test('maneja correctamente un array vacío de criptomonedas', () => {
    // Renderizar el hook con un array vacío
    const { result } = renderHook(() => useCryptoOrder([]));

    // Verificar que el resultado es un array vacío
    expect(result.current.orderedCryptos).toHaveLength(0);
  });

  test('reacciona a cambios en el array de criptomonedas', () => {
    // Configurar el mock para devolver un orden específico
    (getCardOrder as any).mockReturnValue(['ethereum', 'bitcoin']);

    // Renderizar el hook con el array inicial
    const { result, rerender } = renderHook(
      (props) => useCryptoOrder(props),
      { initialProps: mockCryptos }
    );

    // Verificar el orden inicial
    expect(result.current.orderedCryptos).toHaveLength(3);
    expect(result.current.orderedCryptos[0].id).toBe('ethereum');
    expect(result.current.orderedCryptos[1].id).toBe('bitcoin');

    // Crear un nuevo array de criptomonedas con un elemento adicional
    const newCryptos = [
      ...mockCryptos,
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'sol',
        image: 'https://example.com/solana.png',
        current_price: {
          usd: 200,
          btc: 0.004
        }
      }
    ];

    // Re-renderizar el hook con el nuevo array
    rerender(newCryptos);

    // Verificar que el nuevo elemento se ha añadido manteniendo el orden guardado
    expect(result.current.orderedCryptos).toHaveLength(4);
    expect(result.current.orderedCryptos[0].id).toBe('ethereum');
    expect(result.current.orderedCryptos[1].id).toBe('bitcoin');
    // Los elementos no incluidos en el orden guardado deben estar al final
    expect(result.current.orderedCryptos[2].id).toBe('cardano');
    expect(result.current.orderedCryptos[3].id).toBe('solana');
  });
}); 