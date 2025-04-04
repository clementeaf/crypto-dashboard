import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import * as Root from '~/root';

// Mock del hook useTheme
vi.mock('~/root', () => ({
  useTheme: vi.fn()
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();
  
  // Configurar el mock antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('debe renderizar correctamente en modo claro', () => {
    vi.spyOn(Root, 'useTheme').mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    
    render(<ThemeToggle />);
    
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
    vi.spyOn(Root, 'useTheme').mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    
    render(<ThemeToggle />);
    
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
    vi.spyOn(Root, 'useTheme').mockReturnValue({ theme: 'dark', setTheme: mockSetTheme });
    
    render(<ThemeToggle />);
    
    // Hacer clic en el botón de modo claro
    const lightButton = screen.getByTitle('Modo claro');
    fireEvent.click(lightButton);
    
    // Verificar que se llame a setTheme con 'light'
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
  
  it('debe cambiar al modo oscuro al hacer clic en el botón correspondiente', () => {
    vi.spyOn(Root, 'useTheme').mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    
    render(<ThemeToggle />);
    
    // Hacer clic en el botón de modo oscuro
    const darkButton = screen.getByTitle('Modo oscuro');
    fireEvent.click(darkButton);
    
    // Verificar que se llame a setTheme con 'dark'
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
  
  it('debe mostrar etiquetas de texto en pantallas medianas', () => {
    vi.spyOn(Root, 'useTheme').mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    
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
    
    render(<ThemeToggle />);
    
    // Las etiquetas de texto tienen la clase hidden sm:inline, por lo que están ocultas por defecto
    // pero deberían ser visibles en pantallas medianas (simulado con el matchMedia mock)
    const lightLabel = screen.getByText('Claro');
    const darkLabel = screen.getByText('Oscuro');
    
    expect(lightLabel).toBeInTheDocument();
    expect(darkLabel).toBeInTheDocument();
  });
}); 