import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import CryptoCard from '../CryptoCard';
import * as utils from '~/utils/utils';

// Mock de las funciones de utilidad
vi.mock('~/utils/utils', () => ({
  formatUsdPrice: vi.fn((price) => {
    if (price === 60000.50) return '60,000.50';
    if (price === 0.00001234) return '0.00';
    if (price === 1234.56789) return '1,234.57';
    if (price === 1234.56) return '1,234.56';
    if (price === 50000) return '50,000.00';
    if (price === 123456789.12) return '123,456,789.12';
    return price.toString();
  }),
  formatBtcPrice: vi.fn((price) => {
    if (price === 1) return '1.000000';
    if (price === 0.00000023) return '0.00000023';
    if (price === 0.001) return '0.001000';
    if (price === 0.0009999) return '0.00099990';
    if (price === 2.5) return '2.500000';
    return price.toString();
  })
}));

describe('CryptoCard', () => {
  // Restaurar los mocks después de cada prueba
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  // Datos de prueba base
  const baseCrypto = {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://example.com/bitcoin.png',
    current_price: {
      usd: 60000.50,
      btc: 1
    },
    price_change_percentage_24h: 1.5,
    market_cap: 1200000000000,
    total_volume: 30000000000,
    circulating_supply: 19000000
  };
  
  test('renderiza correctamente con todos los datos', () => {
    render(<CryptoCard crypto={baseCrypto} index={0} />);
    
    // Verificar que la imagen se renderiza con el atributo src y alt correctos
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/bitcoin.png');
    expect(image).toHaveAttribute('alt', 'BTC');
    
    // Verificar que el nombre y símbolo se renderizan correctamente
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    
    // Verificar que el ranking se muestra correctamente (#1)
    expect(screen.getByText('#1')).toBeInTheDocument();
    
    // Verificar que el precio en USD se formatea correctamente
    expect(screen.getByText('$60,000.50')).toBeInTheDocument();
    expect(utils.formatUsdPrice).toHaveBeenCalledWith(60000.50);
    
    // Verificar que el precio en BTC se muestra correctamente
    expect(screen.getByText('1.000000 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(1);
  });
  
  test('maneja correctamente diferentes índices', () => {
    render(<CryptoCard crypto={baseCrypto} index={9} />);
    // El índice 9 debe mostrarse como #10
    expect(screen.getByText('#10')).toBeInTheDocument();
    
    render(<CryptoCard crypto={baseCrypto} index={99} />);
    // El índice 99 debe mostrarse como #100
    expect(screen.getByText('#100')).toBeInTheDocument();
  });
  
  test('formatea correctamente valores pequeños de BTC', () => {
    const smallBtcCrypto = {
      ...baseCrypto,
      symbol: 'SHIB',
      name: 'Shiba Inu',
      current_price: {
        usd: 0.00001234,
        btc: 0.00000023
      }
    };
    
    render(<CryptoCard crypto={smallBtcCrypto} index={2} />);
    
    // Verificar que el precio en USD se formatea correctamente para valores pequeños
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(utils.formatUsdPrice).toHaveBeenCalledWith(0.00001234);
    
    // Verificar que el precio en BTC muestra más decimales para valores muy pequeños
    expect(screen.getByText('0.00000023 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(0.00000023);
  });
  
  test('formatea correctamente valores en el límite de decimales', () => {
    const edgeCaseCrypto = {
      ...baseCrypto,
      current_price: {
        usd: 1234.56789,
        btc: 0.001
      }
    };
    
    render(<CryptoCard crypto={edgeCaseCrypto} index={0} />);
    
    // Verificar que el precio en USD trunca los decimales correctamente
    expect(screen.getByText('$1,234.57')).toBeInTheDocument();
    expect(utils.formatUsdPrice).toHaveBeenCalledWith(1234.56789);
    
    // Verificar el caso límite del cambio de formato (0.001 debería usar 6 decimales)
    expect(screen.getByText('0.001000 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(0.001);
  });
  
  test('formatea correctamente los valores por debajo del límite de decimales', () => {
    const belowThresholdCrypto = {
      ...baseCrypto,
      current_price: {
        usd: 1234.56,
        btc: 0.0009999
      }
    };
    
    render(<CryptoCard crypto={belowThresholdCrypto} index={0} />);
    
    // Verificar que el precio en BTC cambia a 8 decimales para valores < 0.001
    expect(screen.getByText('0.00099990 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(0.0009999);
  });
  
  test('maneja correctamente enteros sin decimales', () => {
    const integerCrypto = {
      ...baseCrypto,
      current_price: {
        usd: 50000,
        btc: 1
      }
    };
    
    render(<CryptoCard crypto={integerCrypto} index={0} />);
    
    // Verificar que el precio en USD añade los decimales correctamente
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(utils.formatUsdPrice).toHaveBeenCalledWith(50000);
    
    // Verificar que el precio en BTC añade los decimales correctamente
    expect(screen.getByText('1.000000 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(1);
  });
  
  test('maneja correctamente valores grandes', () => {
    const largeCrypto = {
      ...baseCrypto,
      current_price: {
        usd: 123456789.12,
        btc: 2.5
      }
    };
    
    render(<CryptoCard crypto={largeCrypto} index={0} />);
    
    // Verificar que el precio en USD formatea correctamente valores grandes
    expect(screen.getByText('$123,456,789.12')).toBeInTheDocument();
    expect(utils.formatUsdPrice).toHaveBeenCalledWith(123456789.12);
    
    // Verificar que el precio en BTC formatea correctamente
    expect(screen.getByText('2.500000 BTC')).toBeInTheDocument();
    expect(utils.formatBtcPrice).toHaveBeenCalledWith(2.5);
  });
  
  test('maneja correctamente la ausencia de imagen', () => {
    const noImageCrypto = {
      ...baseCrypto,
      image: undefined
    };
    
    render(<CryptoCard crypto={noImageCrypto} index={0} />);
    
    // La imagen debería seguir existiendo pero con src undefined
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'BTC');
    expect(image).not.toHaveAttribute('src', 'https://example.com/bitcoin.png');
  });
}); 