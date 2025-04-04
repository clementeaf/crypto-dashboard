import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from './SearchFilter';

describe('SearchFilter', () => {
  const mockSetSearchTerm = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente con los valores por defecto', () => {
    render(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    // Verificar que el input existe y está vacío
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    
    // No debe haber botón de limpieza si no hay texto
    const clearButton = screen.queryByTitle('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('debe mostrar el botón de limpieza cuando hay texto en el input', () => {
    render(<SearchFilter searchTerm="Bitcoin" setSearchTerm={mockSetSearchTerm} />);
    
    // Verificar que el input tiene el valor correcto
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toHaveValue('Bitcoin');
    
    // Debe haber un botón de limpieza
    const clearButton = screen.getByTitle('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('debe llamar a setSearchTerm al cambiar el valor del input', async () => {
    const user = userEvent.setup();
    render(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    await user.type(input, 'Ethereum');
    
    // Por cada letra tecleada se llama a setSearchTerm
    expect(mockSetSearchTerm).toHaveBeenCalledTimes('Ethereum'.length);
    // La última llamada debe ser con el texto completo
    expect(mockSetSearchTerm).toHaveBeenLastCalledWith('Ethereum');
  });

  it('debe limpiar el input al hacer clic en el botón de limpieza', () => {
    render(<SearchFilter searchTerm="Bitcoin" setSearchTerm={mockSetSearchTerm} />);
    
    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);
    
    // Debe llamar a setSearchTerm con string vacío
    expect(mockSetSearchTerm).toHaveBeenCalledWith('');
  });

  it('debe mostrar el spinner de carga cuando isLoading es true', () => {
    render(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} isLoading={true} />);
    
    // Debe haber un elemento con la clase animate-spin
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('debe deshabilitar el input cuando isLoading es true', () => {
    render(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeDisabled();
  });

  it('debe cambiar el estilo cuando el input recibe/pierde el foco', () => {
    render(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    const searchContainer = document.querySelector('.grok-search');
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    
    // Por defecto no tiene la clase de enfoque
    expect(searchContainer).not.toHaveClass('ring-2');
    
    // Al recibir foco debe añadir la clase
    fireEvent.focus(input);
    expect(searchContainer).toHaveClass('ring-2');
    
    // Al perder foco debe quitar la clase
    fireEvent.blur(input);
    expect(searchContainer).not.toHaveClass('ring-2');
  });
}); 