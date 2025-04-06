import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import SearchFilter from '../SearchFilter';

// Mock useEffect para evitar el auto-enfoque
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: vi.fn((callback, deps) => {
      // No ejecutar el efecto de auto-enfoque
      if (deps && deps.length === 0) {
        return;
      }
      callback();
    }),
  };
});

describe('SearchFilter', () => {
  test('renderiza correctamente el campo de búsqueda vacío', () => {
    const setSearchTerm = vi.fn();
    render(<SearchFilter searchTerm="" setSearchTerm={setSearchTerm} />);
    
    // Verificar que el campo de búsqueda está presente
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    
    // Verificar que el icono de búsqueda está presente
    const searchIcon = document.querySelector('svg[stroke="currentColor"]');
    expect(searchIcon).toBeInTheDocument();
    
    // Verificar que no hay botón de limpiar
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  test('renderiza correctamente con texto de búsqueda', () => {
    const setSearchTerm = vi.fn();
    const searchText = 'bitcoin';
    
    render(<SearchFilter searchTerm={searchText} setSearchTerm={setSearchTerm} />);
    
    // Verificar que el campo tiene el valor correcto
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toHaveValue(searchText);
    
    // Verificar que el botón de limpiar está presente
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  test('llama a setSearchTerm cuando el valor del input cambia', () => {
    const setSearchTerm = vi.fn();
    
    render(<SearchFilter searchTerm="" setSearchTerm={setSearchTerm} />);
    
    // Cambiar el valor del input
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    fireEvent.change(input, { target: { value: 'eth' } });
    
    // Verificar que se llamó a setSearchTerm con el nuevo valor
    expect(setSearchTerm).toHaveBeenCalledWith('eth');
  });

  test('limpia el campo de búsqueda cuando se hace clic en el botón de limpiar', () => {
    const setSearchTerm = vi.fn();
    
    render(<SearchFilter searchTerm="dogecoin" setSearchTerm={setSearchTerm} />);
    
    // Hacer clic en el botón de limpiar
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    // Verificar que se llamó a setSearchTerm con una cadena vacía
    expect(setSearchTerm).toHaveBeenCalledWith('');
  });

  test('muestra el spinner de carga cuando isLoading=true', () => {
    const setSearchTerm = vi.fn();
    
    render(<SearchFilter searchTerm="" setSearchTerm={setSearchTerm} isLoading={true} />);
    
    // Verificar que el spinner está presente
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Verificar que el input está deshabilitado
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeDisabled();
  });

  test('cambia entre estados enfocado y desenfocado', () => {
    const setSearchTerm = vi.fn();
    
    render(<SearchFilter searchTerm="" setSearchTerm={setSearchTerm} />);
    
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    const searchContainer = document.querySelector('.grok-search');
    
    // Comprobar clase inicial (con o sin escala)
    const initialContainerClass = searchContainer?.className || '';
    
    // Enfocar el input (debería aplicar la escala si no estaba ya aplicada)
    fireEvent.focus(input);
    expect(searchContainer).toHaveClass('scale-[1.01]');
    
    // Desenfocar el input (debería eliminar la escala)
    fireEvent.blur(input);
    expect(searchContainer).not.toHaveClass('scale-[1.01]');
  });

  test('acepta un placeholder personalizado', () => {
    const setSearchTerm = vi.fn();
    const customPlaceholder = 'Buscar criptomoneda...';
    
    render(
      <SearchFilter 
        searchTerm="" 
        setSearchTerm={setSearchTerm} 
        placeholder={customPlaceholder} 
      />
    );
    
    // Verificar que el input tiene el placeholder personalizado
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });
}); 