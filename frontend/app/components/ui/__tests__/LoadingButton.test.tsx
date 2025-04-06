import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LoadingButton from '../LoadingButton';

describe('LoadingButton', () => {
  test('renderiza correctamente el botón con texto', () => {
    render(<LoadingButton>Guardar</LoadingButton>);
    
    // Verificar que el texto se muestra
    expect(screen.getByText('Guardar')).toBeInTheDocument();
    
    // Verificar que no hay spinner de carga
    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  test('muestra el spinner y texto de carga cuando isLoading=true', () => {
    render(
      <LoadingButton isLoading loadingText="Guardando...">
        Guardar
      </LoadingButton>
    );
    
    // Verificar que muestra el texto de carga
    expect(screen.getByText('Guardando...')).toBeInTheDocument();
    
    // Verificar que no muestra el texto original
    expect(screen.queryByText('Guardar')).not.toBeInTheDocument();
    
    // Verificar que el spinner está presente
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Verificar que el botón está deshabilitado en estado de carga
    const boton = screen.getByRole('button');
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute('aria-busy', 'true');
  });

  test('muestra solo el spinner sin texto cuando isLoading=true y no hay loadingText', () => {
    render(
      <LoadingButton isLoading>
        Guardar
      </LoadingButton>
    );
    
    // Verificar que el spinner está presente
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Verificar que aún muestra el texto original
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  test('aplica las diferentes variantes de estilo', () => {
    const { rerender } = render(
      <LoadingButton variant="primary">Primario</LoadingButton>
    );
    
    // Verificar variante primaria
    let boton = screen.getByRole('button');
    expect(boton).toHaveClass('bg-blue-500');
    
    // Verificar variante secundaria
    rerender(<LoadingButton variant="secondary">Secundario</LoadingButton>);
    boton = screen.getByRole('button');
    expect(boton).toHaveClass('bg-gray-200');
    
    // Verificar variante danger
    rerender(<LoadingButton variant="danger">Peligro</LoadingButton>);
    boton = screen.getByRole('button');
    expect(boton).toHaveClass('bg-red-500');
  });

  test('aplica los diferentes tamaños', () => {
    const { rerender } = render(
      <LoadingButton size="sm">Pequeño</LoadingButton>
    );
    
    // Verificar tamaño pequeño
    let boton = screen.getByRole('button');
    expect(boton).toHaveClass('text-sm');
    
    // Verificar tamaño mediano (predeterminado)
    rerender(<LoadingButton size="md">Mediano</LoadingButton>);
    boton = screen.getByRole('button');
    expect(boton).toHaveClass('px-3');
    
    // Verificar tamaño grande
    rerender(<LoadingButton size="lg">Grande</LoadingButton>);
    boton = screen.getByRole('button');
    expect(boton).toHaveClass('text-lg');
  });

  test('aplica el ancho completo cuando fullWidth=true', () => {
    render(<LoadingButton fullWidth>Ancho completo</LoadingButton>);
    
    const boton = screen.getByRole('button');
    expect(boton).toHaveClass('w-full');
  });

  test('maneja correctamente el evento onClick', () => {
    const handleClick = vi.fn();
    render(<LoadingButton onClick={handleClick}>Clic</LoadingButton>);
    
    // Hacer clic en el botón
    fireEvent.click(screen.getByText('Clic'));
    
    // Verificar que se llamó al manejador de eventos
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('no llama a onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    render(
      <LoadingButton onClick={handleClick} disabled>
        Deshabilitado
      </LoadingButton>
    );
    
    // Hacer clic en el botón deshabilitado
    fireEvent.click(screen.getByText('Deshabilitado'));
    
    // Verificar que no se llamó al manejador de eventos
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('renderiza correctamente con un icono', () => {
    const testIcon = <span data-testid="test-icon">★</span>;
    render(
      <LoadingButton icon={testIcon}>
        Con icono
      </LoadingButton>
    );
    
    // Verificar que el icono y el texto están presentes
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Con icono')).toBeInTheDocument();
  });
}); 