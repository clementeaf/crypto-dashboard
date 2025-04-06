import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DashboardStats from '../DashboardStats';

// Mock de los componentes SearchFilter y AutoRefreshControl
vi.mock('~/components/ui/SearchFilter', () => ({
  default: ({ 
    searchTerm, 
    setSearchTerm, 
    isLoading, 
    placeholder 
  }: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    isLoading: boolean;
    placeholder: string;
  }) => (
    <div data-testid="search-filter-mock">
      <input 
        type="text" 
        data-testid="search-input" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
        placeholder={placeholder}
      />
    </div>
  )
}));

vi.mock('~/components/ui/AutoRefreshControl', () => ({
  default: ({ 
    autoRefresh, 
    refreshInterval, 
    onToggleAutoRefresh, 
    onChangeInterval, 
    disabled 
  }: {
    autoRefresh: boolean;
    refreshInterval: number;
    onToggleAutoRefresh: () => void;
    onChangeInterval: (interval: number) => void;
    disabled: boolean;
  }) => (
    <div data-testid="auto-refresh-control-mock">
      <button 
        data-testid="toggle-auto-refresh"
        onClick={onToggleAutoRefresh}
        disabled={disabled}
      >
        {autoRefresh ? 'Desactivar' : 'Activar'}
      </button>
      <select 
        data-testid="refresh-interval"
        value={refreshInterval}
        onChange={(e) => onChangeInterval(Number(e.target.value))}
        disabled={disabled}
      >
        <option value="30">30s</option>
        <option value="60">60s</option>
        <option value="120">120s</option>
      </select>
    </div>
  )
}));

describe('DashboardStats', () => {
  const defaultProps = {
    username: 'TestUser',
    totalCoins: 100,
    filteredCoins: 50,
    autoRefresh: false,
    refreshInterval: 60,
    isLoading: false,
    lastUpdated: '2023-05-28 12:30:00',
    searchTerm: '',
    onSearchChange: vi.fn(),
    onToggleAutoRefresh: vi.fn(),
    onChangeRefreshInterval: vi.fn()
  };

  test('se renderiza correctamente con los datos proporcionados', () => {
    render(<DashboardStats {...defaultProps} />);
    
    // Verificar que el nombre de usuario está presente
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    
    // Verificar que los valores numéricos se muestran correctamente
    expect(screen.getByText('100')).toBeInTheDocument(); // Total coins
    expect(screen.getByText('50')).toBeInTheDocument(); // Filtered coins
    
    // Usar testId para verificar elementos específicos
    const intervalSection = screen.getByText('Interval').closest('div')?.nextSibling;
    expect(intervalSection).toHaveTextContent('60');
    
    // Verificar que el estado de auto-refresh se muestra correctamente
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    
    // Verificar que la última actualización se muestra
    expect(screen.getByText('Updated: 2023-05-28 12:30:00')).toBeInTheDocument();
    
    // Verificar que los componentes hijos se renderizan
    expect(screen.getByTestId('search-filter-mock')).toBeInTheDocument();
    expect(screen.getByTestId('auto-refresh-control-mock')).toBeInTheDocument();
  });
  
  test('muestra el indicador de carga cuando isLoading es true', () => {
    render(<DashboardStats {...defaultProps} isLoading={true} />);
    
    // Verificar que se muestra "Updating..." en lugar de la última actualización
    expect(screen.getByText('Updating...')).toBeInTheDocument();
    expect(screen.queryByText('Updated:')).not.toBeInTheDocument();
    
    // Verificar que hay un elemento SVG con clase animate-spin
    const spinnerElement = document.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
  });
  
  test('muestra "Enabled" cuando autoRefresh es true', () => {
    render(<DashboardStats {...defaultProps} autoRefresh={true} />);
    
    // Verificar que el estado de auto-refresh se muestra como "Enabled"
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.queryByText('Disabled')).not.toBeInTheDocument();
  });
  
  test('no muestra la última actualización cuando lastUpdated es null', () => {
    render(<DashboardStats {...defaultProps} lastUpdated={null} />);
    
    // Verificar que no se muestra ninguna información de actualización
    expect(screen.queryByText(/Updated:/)).not.toBeInTheDocument();
  });
  
  test('llama a onSearchChange cuando se modifica el texto de búsqueda', () => {
    const onSearchChange = vi.fn();
    
    render(<DashboardStats {...defaultProps} onSearchChange={onSearchChange} />);
    
    // Simular cambio en el input de búsqueda
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'bitcoin' } });
    
    // Verificar que onSearchChange fue llamado con el valor correcto
    expect(onSearchChange).toHaveBeenCalledWith('bitcoin');
  });
  
  test('llama a onToggleAutoRefresh cuando se hace clic en el botón de activar/desactivar', () => {
    const onToggleAutoRefresh = vi.fn();
    
    render(<DashboardStats {...defaultProps} onToggleAutoRefresh={onToggleAutoRefresh} />);
    
    // Simular clic en el botón de toggle
    const toggleButton = screen.getByTestId('toggle-auto-refresh');
    fireEvent.click(toggleButton);
    
    // Verificar que onToggleAutoRefresh fue llamado
    expect(onToggleAutoRefresh).toHaveBeenCalled();
  });
  
  test('llama a onChangeRefreshInterval cuando se cambia el intervalo', () => {
    const onChangeRefreshInterval = vi.fn();
    
    render(<DashboardStats {...defaultProps} onChangeRefreshInterval={onChangeRefreshInterval} />);
    
    // Simular cambio en el selector de intervalo
    const intervalSelect = screen.getByTestId('refresh-interval');
    fireEvent.change(intervalSelect, { target: { value: '120' } });
    
    // Verificar que onChangeRefreshInterval fue llamado con el valor correcto
    expect(onChangeRefreshInterval).toHaveBeenCalledWith(120);
  });
  
  test('los controles están deshabilitados cuando isLoading es true', () => {
    render(<DashboardStats {...defaultProps} isLoading={true} />);
    
    // Verificar que los controles de AutoRefreshControl están deshabilitados
    // (esto se comprueba indirectamente a través de las props que se pasan al componente mockeado)
    const toggleButton = screen.getByTestId('toggle-auto-refresh');
    const intervalSelect = screen.getByTestId('refresh-interval');
    
    expect(toggleButton).toBeDisabled();
    expect(intervalSelect).toBeDisabled();
  });
}); 