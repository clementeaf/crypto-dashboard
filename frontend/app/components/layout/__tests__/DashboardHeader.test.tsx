import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DashboardHeader from '../DashboardHeader';

// Mock del componente ThemeToggle
vi.mock('~/components/ui/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle-mock">ThemeToggle</div>
}));

describe('DashboardHeader', () => {
  test('se renderiza correctamente con el título y botones', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh} 
      />
    );
    
    // Verificar que el título está presente
    expect(screen.getByText('Dashboard de Prueba')).toBeInTheDocument();
    
    // Verificar que el botón de actualización está presente
    expect(screen.getByText('Update')).toBeInTheDocument();
    
    // Verificar que el ThemeToggle está presente
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
    
    // Verificar que el botón de menú móvil está presente
    expect(screen.getByLabelText('Menú')).toBeInTheDocument();
  });
  
  test('muestra un spinner de carga cuando isLoading es true', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={true} 
        onRefresh={onRefresh} 
      />
    );
    
    // Verificar que el texto de carga está presente
    expect(screen.getByText('Updating...')).toBeInTheDocument();
    
    // Verificar que hay un elemento SVG con clase animate-spin
    const spinnerElement = document.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
  });
  
  test('muestra el botón de logout cuando se proporciona onLogout', () => {
    const onRefresh = vi.fn();
    const onLogout = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh}
        onLogout={onLogout}
      />
    );
    
    // Verificar que el botón de logout está presente
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  test('no muestra el botón de logout cuando no se proporciona onLogout', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh}
      />
    );
    
    // Verificar que el botón de logout no está presente
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
  
  test('abre y cierra el menú móvil al hacer clic en el botón de menú', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh} 
      />
    );
    
    // Verificar que el menú móvil no está visible inicialmente
    expect(screen.queryByText('Update')).toBeTruthy();
    const mobileMenus = document.querySelectorAll('.md\\:hidden.mt-4');
    expect(mobileMenus.length).toBe(0);
    
    // Hacer clic en el botón de menú
    const menuButton = screen.getByLabelText('Menú');
    fireEvent.click(menuButton);
    
    // Verificar que el menú móvil está visible después del clic
    const mobileMenusAfterClick = document.querySelectorAll('.md\\:hidden.mt-4');
    expect(mobileMenusAfterClick.length).toBe(1);
    
    // Hacer clic nuevamente en el botón de menú
    fireEvent.click(menuButton);
    
    // Verificar que el menú móvil se oculta nuevamente
    const mobileMenusAfterSecondClick = document.querySelectorAll('.md\\:hidden.mt-4');
    expect(mobileMenusAfterSecondClick.length).toBe(0);
  });
  
  test('llama a onRefresh cuando se hace clic en el botón de actualización', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh} 
      />
    );
    
    // Hacer clic en el botón de actualización (desktop)
    const updateButtons = screen.getAllByText('Update');
    fireEvent.click(updateButtons[0]);
    
    // Verificar que onRefresh fue llamado
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
  
  test('llama a onLogout cuando se hace clic en el botón de logout', () => {
    const onRefresh = vi.fn();
    const onLogout = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={false} 
        onRefresh={onRefresh}
        onLogout={onLogout}
      />
    );
    
    // Hacer clic en el botón de logout (desktop)
    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]);
    
    // Verificar que onLogout fue llamado
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
  
  test('el botón de actualización está deshabilitado cuando isLoading es true', () => {
    const onRefresh = vi.fn();
    
    render(
      <DashboardHeader 
        title="Dashboard de Prueba" 
        isLoading={true} 
        onRefresh={onRefresh} 
      />
    );
    
    // Verificar que el botón de actualización está deshabilitado
    const updateButtons = screen.getAllByText('Updating...');
    expect(updateButtons[0].closest('button')).toBeDisabled();
    
    // Hacer clic en el botón deshabilitado
    fireEvent.click(updateButtons[0]);
    
    // Verificar que onRefresh no fue llamado
    expect(onRefresh).not.toHaveBeenCalled();
  });
}); 