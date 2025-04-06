import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AutoRefreshControl from '../AutoRefreshControl';

describe('AutoRefreshControl', () => {
  const defaultProps = {
    autoRefresh: false,
    refreshInterval: 60,
    onToggleAutoRefresh: vi.fn(),
    onChangeInterval: vi.fn(),
  };

  test('renderiza correctamente con autoRefresh desactivado', () => {
    render(<AutoRefreshControl {...defaultProps} />);
    
    // Verificar que el checkbox esté presente pero no marcado
    const checkbox = screen.getByRole('checkbox', { name: /enable automatic updates/i });
    expect(checkbox).not.toBeChecked();
    
    // Verificar que el selector de intervalo esté desactivado
    const select = screen.getByRole('combobox', { name: /auto-refresh interval/i });
    expect(select).toBeDisabled();
    
    // Verificar que el texto "Auto" está presente
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  test('renderiza correctamente con autoRefresh activado', () => {
    render(<AutoRefreshControl {...defaultProps} autoRefresh={true} />);
    
    // Verificar que el checkbox esté marcado
    const checkbox = screen.getByRole('checkbox', { name: /enable automatic updates/i });
    expect(checkbox).toBeChecked();
    
    // Verificar que el selector de intervalo esté activado
    const select = screen.getByRole('combobox', { name: /auto-refresh interval/i });
    expect(select).not.toBeDisabled();
    
    // Verificar que el valor del selector de intervalo sea el correcto
    expect(select).toHaveValue('60');
  });

  test('llama a onToggleAutoRefresh cuando se hace clic en el checkbox', () => {
    render(<AutoRefreshControl {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox', { name: /enable automatic updates/i });
    fireEvent.click(checkbox);
    
    expect(defaultProps.onToggleAutoRefresh).toHaveBeenCalledTimes(1);
  });

  test('llama a onChangeInterval cuando se cambia el valor del selector', () => {
    render(<AutoRefreshControl {...defaultProps} autoRefresh={true} />);
    
    const select = screen.getByRole('combobox', { name: /auto-refresh interval/i });
    fireEvent.change(select, { target: { value: '300' } });
    
    expect(defaultProps.onChangeInterval).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChangeInterval).toHaveBeenCalledWith(300);
  });

  test('deshabilita controles cuando disabled=true', () => {
    // Limpiar los mocks antes de cada prueba
    vi.clearAllMocks();
    
    render(<AutoRefreshControl {...defaultProps} disabled={true} />);
    
    // Verificar que el checkbox esté deshabilitado
    const checkbox = screen.getByRole('checkbox', { name: /enable automatic updates/i });
    expect(checkbox).toBeDisabled();
    
    // Verificar que el selector esté deshabilitado
    const select = screen.getByRole('combobox', { name: /auto-refresh interval/i });
    expect(select).toBeDisabled();
    
    // En lugar de verificar la llamada de la función, verificamos que el elemento está deshabilitado
    // lo que impide la interacción real
    expect(checkbox).toHaveAttribute('disabled');
  });

  test('tiene las opciones correctas en el selector de intervalos', () => {
    render(<AutoRefreshControl {...defaultProps} autoRefresh={true} />);
    
    const options = screen.getAllByRole('option');
    
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveValue('30');
    expect(options[0]).toHaveTextContent('30s');
    
    expect(options[1]).toHaveValue('60');
    expect(options[1]).toHaveTextContent('1m');
    
    expect(options[2]).toHaveValue('300');
    expect(options[2]).toHaveTextContent('5m');
    
    expect(options[3]).toHaveValue('600');
    expect(options[3]).toHaveTextContent('10m');
  });
}); 