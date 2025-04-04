import { vi, describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { renderWithProviders, ThemeProvider, useTheme } from '~/test/test-utils';

// Mock del hook useTheme de root con nuestro propio hook de test-utils
vi.mock('~/root', () => ({
  useTheme: () => useTheme()
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('debe renderizar correctamente en modo claro', () => {
    renderWithProviders(<ThemeToggle />, { initialTheme: 'light' });
    
    // Verificar que se renderice el botón de modo claro (activo)
    const lightButton = screen.getByTitle('Modo claro');
    expect(lightButton).toBeInTheDocument();
    expect(lightButton).toHaveClass('bg-white');
    expect(lightButton).toHaveClass('text-blue-600');
    
    // Verificar que se renderice el botón de modo oscuro (inactivo)
    const darkButton = screen.getByTitle('Modo oscuro');
    expect(darkButton).toBeInTheDocument();
    expect(darkButton).not.toHaveClass('bg-gray-900');
  });
  
  it('debe renderizar correctamente en modo oscuro', () => {
    renderWithProviders(<ThemeToggle />, { initialTheme: 'dark' });
    
    // Verificar que se renderice el botón de modo oscuro (activo)
    const darkButton = screen.getByTitle('Modo oscuro');
    expect(darkButton).toBeInTheDocument();
    expect(darkButton).toHaveClass('bg-gray-900');
    expect(darkButton).toHaveClass('text-blue-400');
    
    // Verificar que se renderice el botón de modo claro (inactivo)
    const lightButton = screen.getByTitle('Modo claro');
    expect(lightButton).toBeInTheDocument();
    expect(lightButton).not.toHaveClass('bg-white');
  });
  
  it('debe cambiar al modo claro al hacer clic en el botón correspondiente', () => {
    renderWithProviders(<ThemeToggle />, { initialTheme: 'dark' });
    
    // Hacer clic en el botón de modo claro
    const lightButton = screen.getByTitle('Modo claro');
    fireEvent.click(lightButton);
    
    // En este caso, la verificación se hará a través del cambio visual
    // ya que estamos usando un ThemeProvider real en lugar de un mock
    expect(lightButton).toHaveClass('bg-white');
  });
  
  it('debe cambiar al modo oscuro al hacer clic en el botón correspondiente', () => {
    renderWithProviders(<ThemeToggle />, { initialTheme: 'light' });
    
    // Hacer clic en el botón de modo oscuro
    const darkButton = screen.getByTitle('Modo oscuro');
    fireEvent.click(darkButton);
    
    // Verificar que el botón ahora tiene las clases activas
    expect(darkButton).toHaveClass('bg-gray-900');
  });
  
  it('debe mostrar etiquetas de texto en pantallas medianas', () => {
    // Mock de matchMedia para simular pantalla mediana
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    renderWithProviders(<ThemeToggle />, { initialTheme: 'light' });
    
    // Las etiquetas de texto tienen la clase hidden sm:inline, por lo que están ocultas por defecto
    // pero deberían ser visibles en pantallas medianas (simulado con el matchMedia mock)
    const lightLabel = screen.getByText('Claro');
    const darkLabel = screen.getByText('Oscuro');
    
    expect(lightLabel).toBeInTheDocument();
    expect(darkLabel).toBeInTheDocument();
  });
}); 