import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Dashboard from '../Dashboard';
import type { Cryptocurrency } from '~/types/crypto';

// Mocks simplificados para componentes y hooks

// Mock para setLastRefreshTime
vi.mock('~/utils/storage', () => ({
  setLastRefreshTime: vi.fn()
}));

// Mock para useNavigation de Remix
vi.mock('@remix-run/react', () => ({
  useNavigation: () => ({ state: 'idle' })
}));

// Mock de los componentes hijos para evitar renderizarlos completamente
vi.mock('../DashboardHeader', () => ({
  default: ({ title }: { title: string }) => <header data-testid="dashboard-header">{title}</header>
}));

vi.mock('../DashboardStats', () => ({
  default: ({ username }: { username: string }) => <div data-testid="dashboard-stats">{username}</div>
}));

vi.mock('../DashboardFooter', () => ({
  default: () => <footer data-testid="dashboard-footer"></footer>
}));

vi.mock('../../ui/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => <div data-testid="error-message">{message}</div>
}));

vi.mock('../../ui/CryptoSkeletonLoader', () => ({
  default: () => <div data-testid="skeleton-loader" className="animate-pulse"></div>
}));

vi.mock('../../cards/CryptoCardGrid', () => ({
  default: ({ cryptos }: { cryptos: Cryptocurrency[] }) => (
    <div data-testid="crypto-grid">
      {cryptos.map((crypto: Cryptocurrency) => (
        <div key={crypto.id} data-testid={`crypto-${crypto.id}`}>{crypto.name}</div>
      ))}
    </div>
  )
}));

// Mock simplificado para hooks personalizados
vi.mock('~/hooks/useCryptoOrder', () => ({
  useCryptoOrder: (cryptos: Cryptocurrency[]) => ({
    orderedCryptos: cryptos,
    updateOrder: vi.fn()
  })
}));

vi.mock('~/hooks/useFilteredCryptos', () => ({
  useFilteredCryptos: (cryptos: Cryptocurrency[]) => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
    filteredCryptos: cryptos
  })
}));

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
  }
];

describe('Dashboard', () => {
  // Configuración para controlar el temporizador
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('renderiza correctamente el dashboard con todos sus componentes', () => {
    const onRefresh = vi.fn();
    const onLogout = vi.fn();
    
    render(
      <Dashboard
        cryptocurrencies={mockCryptos}
        onRefresh={onRefresh}
        apiError={null}
        title="Test Dashboard"
        username="TestUser"
        onLogout={onLogout}
        lastUpdated="2023-05-28 12:30:00"
        autoRefresh={false}
        onToggleAutoRefresh={vi.fn()}
        refreshInterval={60}
        onChangeRefreshInterval={vi.fn()}
      />
    );
    
    // Verificar que el header está presente con el título correcto
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    
    // Verificar que el dashboard-stats está presente con el nombre de usuario
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    
    // Verificar que la sección de criptomonedas está presente
    expect(screen.getByText('Cryptocurrencies')).toBeInTheDocument();
    
    // Verificar que el grid de criptomonedas está presente
    expect(screen.getByTestId('crypto-grid')).toBeInTheDocument();
    
    // Verificar que las criptomonedas se muestran
    expect(screen.getByTestId('crypto-bitcoin')).toBeInTheDocument();
    expect(screen.getByTestId('crypto-ethereum')).toBeInTheDocument();
    
    // Verificar que el footer está presente
    expect(screen.getByTestId('dashboard-footer')).toBeInTheDocument();
  });

  test('muestra mensaje de error cuando apiError está presente', () => {
    const errorMessage = 'API Error: Could not fetch data';
    
    render(
      <Dashboard
        cryptocurrencies={mockCryptos}
        onRefresh={vi.fn()}
        apiError={errorMessage}
        autoRefresh={false}
        onToggleAutoRefresh={vi.fn()}
        refreshInterval={60}
        onChangeRefreshInterval={vi.fn()}
      />
    );
    
    // Verificar que el mensaje de error se muestra
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('llama a onRefresh cuando se activa la actualización automática', () => {
    const onRefresh = vi.fn();
    
    render(
      <Dashboard
        cryptocurrencies={mockCryptos}
        onRefresh={onRefresh}
        apiError={null}
        autoRefresh={true}
        onToggleAutoRefresh={vi.fn()}
        refreshInterval={60}
        onChangeRefreshInterval={vi.fn()}
      />
    );
    
    // Avanzar el tiempo para activar el intervalo
    act(() => {
      vi.advanceTimersByTime(60000); // 60 segundos
    });
    
    // Verificar que onRefresh fue llamado
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  test('no activa la actualización automática cuando autoRefresh es false', () => {
    const onRefresh = vi.fn();
    
    render(
      <Dashboard
        cryptocurrencies={mockCryptos}
        onRefresh={onRefresh}
        apiError={null}
        autoRefresh={false}
        onToggleAutoRefresh={vi.fn()}
        refreshInterval={60}
        onChangeRefreshInterval={vi.fn()}
      />
    );
    
    // Avanzar el tiempo
    act(() => {
      vi.advanceTimersByTime(120000); // 2 minutos
    });
    
    // Verificar que onRefresh no fue llamado
    expect(onRefresh).not.toHaveBeenCalled();
  });
}); 