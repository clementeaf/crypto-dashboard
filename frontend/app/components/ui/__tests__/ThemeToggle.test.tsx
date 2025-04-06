import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ThemeToggle from '../ThemeToggle';

// Mock del hook useTheme
vi.mock('~/root', () => ({
  useTheme: vi.fn()
}));

import { useTheme } from '~/root';

describe('ThemeToggle', () => {
  test('renderiza correctamente en modo oscuro', () => {
    // Configurar el mock para simular modo oscuro
    const mockToggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      isDark: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeToggle />);
    
    // Verificar que muestra el texto para cambiar a modo claro
    expect(screen.getByText('Light')).toBeInTheDocument();
    
    // Verificar que tiene el aria-label correcto
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    
    // Verificar que el icono del sol está presente
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.innerHTML).toContain('evenodd');
  });

  test('renderiza correctamente en modo claro', () => {
    // Configurar el mock para simular modo claro
    const mockToggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      isDark: false,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeToggle />);
    
    // Verificar que muestra el texto para cambiar a modo oscuro
    expect(screen.getByText('Dark')).toBeInTheDocument();
    
    // Verificar que tiene el aria-label correcto
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    
    // Verificar que el icono de la luna está presente (buscando por una parte del path)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Verificar que el path del SVG contiene la parte específica que identifica al icono de luna
    expect(svg?.innerHTML).toContain('M17.293 13.293A8 8 0');
  });

  test('llama a toggleTheme cuando se hace clic en el botón', () => {
    // Configurar el mock
    const mockToggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      isDark: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeToggle />);
    
    // Hacer clic en el botón
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verificar que se llamó a la función toggleTheme
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('tiene las clases correctas para estilización', () => {
    // Configurar el mock
    const mockToggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      isDark: true,
      toggleTheme: mockToggleTheme
    });
    
    render(<ThemeToggle />);
    
    // Verificar que el botón tiene las clases correctas
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('dark:bg-gray-800');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('transition-colors');
    
    // Verificar que el texto tiene las clases correctas
    const text = screen.getByText('Light');
    expect(text).toHaveClass('text-gray-600');
    expect(text).toHaveClass('dark:text-white');
  });
}); 