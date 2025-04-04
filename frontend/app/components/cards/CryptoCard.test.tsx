import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CryptoCard from './CryptoCard';
import type { Cryptocurrency } from '~/types/crypto';

// Mock de una criptomoneda para las pruebas
const mockCrypto: Cryptocurrency = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'https://example.com/bitcoin.png',
  current_price: {
    usd: 50000.75,
    btc: 1
  },
  price_change_percentage_24h: 5.25,
  market_cap: 950000000000,
  total_volume: 30000000000
};

// Mock de una criptomoneda con tendencia negativa
const mockCryptoNegativeTrend: Cryptocurrency = {
  ...mockCrypto,
  price_change_percentage_24h: -3.45,
};

// Mock de funciones para drag and drop
const mockDragStart = vi.fn();
const mockDragEnter = vi.fn();
const mockDragEnd = vi.fn();
const mockDragOver = vi.fn();

describe('CryptoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente la información de la criptomoneda', () => {
    render(
      <CryptoCard 
        crypto={mockCrypto}
        index={0}
        isDragging={false}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    // Verificar que se muestra el nombre, símbolo y precio correctamente
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('$50,000.75')).toBeInTheDocument();
    
    // Verificar el cambio de precio en 24h
    expect(screen.getByText(/↑ 5.25%/)).toBeInTheDocument();
    
    // Verificar que se muestra la imagen correcta
    const image = screen.getByAltText('Bitcoin');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/bitcoin.png');
    
    // Verificar que se muestran los datos de market cap y volumen
    expect(screen.getByText('$950.00B')).toBeInTheDocument();
    expect(screen.getByText('$30.00B')).toBeInTheDocument();
  });

  it('debe renderizar correctamente una criptomoneda con tendencia negativa', () => {
    render(
      <CryptoCard 
        crypto={mockCryptoNegativeTrend}
        index={0}
        isDragging={false}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    // Verificar el cambio de precio negativo
    expect(screen.getByText(/↓ -3.45%/)).toBeInTheDocument();
  });

  it('debe aplicar la clase de arrastre cuando isDragging es true', () => {
    const { container } = render(
      <CryptoCard 
        crypto={mockCrypto}
        index={0}
        isDragging={true}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    // Verificar que se aplicó la clase de arrastre
    const cardElement = container.querySelector('.grok-card');
    expect(cardElement).toHaveClass('opacity-70');
    expect(cardElement).toHaveClass('scale-[1.02]');
  });

  it('debe llamar a las funciones de arrastre correspondientes', () => {
    render(
      <CryptoCard 
        crypto={mockCrypto}
        index={2}
        isDragging={false}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    const cardElement = screen.getByText('Bitcoin').closest('.grok-card');
    expect(cardElement).toBeInTheDocument();
    
    if (cardElement) {
      // Simular eventos de arrastre
      fireEvent.dragStart(cardElement);
      expect(mockDragStart).toHaveBeenCalledWith(2);
      
      fireEvent.dragEnter(cardElement);
      expect(mockDragEnter).toHaveBeenCalledWith(2);
      
      fireEvent.dragEnd(cardElement);
      expect(mockDragEnd).toHaveBeenCalled();
      
      fireEvent.dragOver(cardElement);
      expect(mockDragOver).toHaveBeenCalled();
    }
  });

  it('debe agregar clase de hover al colocar el ratón sobre la tarjeta', () => {
    const { container } = render(
      <CryptoCard 
        crypto={mockCrypto}
        index={0}
        isDragging={false}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    const cardElement = container.querySelector('.grok-card');
    expect(cardElement).not.toHaveClass('ring-1');
    
    if (cardElement) {
      // Simular hover
      fireEvent.mouseEnter(cardElement);
      expect(cardElement).toHaveClass('ring-1');
      
      // Simular salida del hover
      fireEvent.mouseLeave(cardElement);
      expect(cardElement).not.toHaveClass('ring-1');
    }
  });

  it('debe formatear correctamente precios pequeños', () => {
    const smallPriceCrypto = {
      ...mockCrypto,
      current_price: {
        usd: 0.00004532,
        btc: 0.00000089
      }
    };
    
    render(
      <CryptoCard 
        crypto={smallPriceCrypto}
        index={0}
        isDragging={false}
        onDragStart={mockDragStart}
        onDragEnter={mockDragEnter}
        onDragEnd={mockDragEnd}
        onDragOver={mockDragOver}
      />
    );
    
    // Verificar que se muestran los decimales correctos para valores pequeños
    expect(screen.getByText('$0.00004532')).toBeInTheDocument();
    expect(screen.getByText('0.00000089 BTC')).toBeInTheDocument();
  });
}); 