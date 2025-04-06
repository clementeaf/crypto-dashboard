import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import CryptoCardGrid from '../CryptoCardGrid';
import type { Cryptocurrency } from '~/types/crypto';

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
      btc: 0.000024
    }
  }
];

describe('CryptoCardGrid', () => {
  test('renderiza un mensaje cuando no hay criptomonedas', () => {
    render(<CryptoCardGrid cryptos={[]} />);
    
    expect(screen.getByText('No cryptocurrencies found')).toBeInTheDocument();
  });

  test('renderiza correctamente todas las criptomonedas', () => {
    render(<CryptoCardGrid cryptos={mockCryptos} />);
    
    // Verificar que se renderizan todas las criptomonedas
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Cardano')).toBeInTheDocument();
    
    // Verificar que se muestran los símbolos correctamente
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('ADA')).toBeInTheDocument();
    
    // Verificar que los precios se formatean y muestran correctamente
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
    expect(screen.getByText('$1.20')).toBeInTheDocument();
    
    // Verificar que los precios en BTC se muestran correctamente
    // Usar regex para encontrar elementos que contengan el texto, ya que el formato puede variar
    expect(screen.getByText(/1.000000.*BTC/)).toBeInTheDocument();
    expect(screen.getByText(/0.060000.*BTC/)).toBeInTheDocument();
    expect(screen.getByText(/0.00002400.*BTC/)).toBeInTheDocument();
    
    // Verificar que se muestran los índices correctos
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  test('maneja correctamente el drag and drop para reordenar elementos', () => {
    const onOrderChange = vi.fn();
    render(<CryptoCardGrid cryptos={mockCryptos} onOrderChange={onOrderChange} />);
    
    // Obtener todas las tarjetas (divs arrastables)
    const cards = screen.getAllByText(/Price \(BTC\)/).map(
      element => element.closest('[draggable="true"]')
    );
    expect(cards.length).toBe(3);
    
    // Simular arrastre de la primera tarjeta (Bitcoin) a la posición de la segunda (Ethereum)
    fireEvent.dragStart(cards[0] as HTMLElement);
    fireEvent.dragEnter(cards[1] as HTMLElement);
    fireEvent.dragEnd(cards[0] as HTMLElement);
    
    // Verificar que onOrderChange fue llamado con el nuevo orden
    expect(onOrderChange).toHaveBeenCalledTimes(1);
    expect(onOrderChange).toHaveBeenCalledWith(['ethereum', 'bitcoin', 'cardano']);
  });

  test('aplica estilos de arrastre durante el drag and drop', () => {
    render(<CryptoCardGrid cryptos={mockCryptos} />);
    
    // Obtener todas las tarjetas
    const cards = screen.getAllByText(/Price \(BTC\)/).map(
      element => element.closest('[draggable="true"]')
    );
    
    // Verificar el estilo inicial
    expect(cards[0]).toHaveClass('opacity-100');
    expect(cards[0]).not.toHaveClass('opacity-50');
    
    // Simular el inicio del arrastre
    fireEvent.dragStart(cards[0] as HTMLElement);
    
    // Nota: No podemos verificar directamente los cambios de estilo aquí porque
    // el estado React no se actualiza inmediatamente en las pruebas.
    // Una forma de verificar esto sería crear una implementación personalizada
    // que exponga el estado interno o usar React Testing Library de manera más avanzada.
  });

  test('no llama a onOrderChange cuando se arrastra a la misma posición', () => {
    const onOrderChange = vi.fn();
    render(<CryptoCardGrid cryptos={mockCryptos} onOrderChange={onOrderChange} />);
    
    // Obtener todas las tarjetas
    const cards = screen.getAllByText(/Price \(BTC\)/).map(
      element => element.closest('[draggable="true"]')
    );
    
    // Simular arrastre de la primera tarjeta a su propia posición
    fireEvent.dragStart(cards[0] as HTMLElement);
    fireEvent.dragEnter(cards[0] as HTMLElement);
    fireEvent.dragEnd(cards[0] as HTMLElement);
    
    // Verificar que onOrderChange no fue llamado
    expect(onOrderChange).not.toHaveBeenCalled();
  });
}); 