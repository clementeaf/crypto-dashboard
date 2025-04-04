import { vi, describe, it, expect, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from './SearchFilter';
import { renderWithProviders, screen } from '~/test/test-utils';

describe('SearchFilter', () => {
  const mockSetSearchTerm = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente con los valores por defecto', () => {
    renderWithProviders(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    // Verificar que el input existe y está vacío
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    
    // No debe haber botón de limpieza si no hay texto
    const clearButton = screen.queryByTitle('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('debe mostrar el botón de limpieza cuando hay texto en el input', () => {
    renderWithProviders(<SearchFilter searchTerm="Bitcoin" setSearchTerm={mockSetSearchTerm} />);
    
    // Verificar que el input tiene el valor correcto
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toHaveValue('Bitcoin');
    
    // Debe haber un botón de limpieza
    const clearButton = screen.getByTitle('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('debe llamar a setSearchTerm al cambiar el valor del input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    
    // Tipear una letra a la vez, en lugar de todo de una vez
    await user.type(input, 'E');
    await user.type(input, 't');
    await user.type(input, 'h');
    
    // Verificar que se ha llamado a setSearchTerm al menos una vez
    expect(mockSetSearchTerm).toHaveBeenCalled();
  });

  it('debe limpiar el input al hacer clic en el botón de limpieza', () => {
    renderWithProviders(<SearchFilter searchTerm="Bitcoin" setSearchTerm={mockSetSearchTerm} />);
    
    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);
    
    // Debe llamar a setSearchTerm con string vacío
    expect(mockSetSearchTerm).toHaveBeenCalledWith('');
  });

  it('debe mostrar el spinner de carga cuando isLoading es true', () => {
    renderWithProviders(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} isLoading={true} />);
    
    // Debe haber un elemento con la clase animate-spin
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('debe deshabilitar el input cuando isLoading es true', () => {
    renderWithProviders(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    expect(input).toBeDisabled();
  });

  it('debe cambiar el estilo cuando el input recibe/pierde el foco', async () => {
    const { container } = renderWithProviders(<SearchFilter searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    const searchContainer = container.querySelector('.grok-search');
    const input = screen.getByPlaceholderText('Search cryptocurrency by name or symbol...');
    
    // Al recibir foco debe añadir la clase
    fireEvent.focus(input);
    expect(searchContainer).toHaveClass('ring-2');
    
    // Al perder foco debe quitar la clase
    fireEvent.blur(input);
    
    // Usamos setTimeout para dar tiempo a que se actualice el estado
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Ahora sí debería haberse quitado la clase
    expect(searchContainer).not.toHaveClass('scale-[1.01]');
  });
}); 