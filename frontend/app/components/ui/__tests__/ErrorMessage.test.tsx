import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  test('renderiza correctamente solo con mensaje', () => {
    const mensaje = 'Ha ocurrido un error';
    render(<ErrorMessage message={mensaje} />);
    
    // Verificar que el mensaje se muestra
    expect(screen.getByText(mensaje)).toBeInTheDocument();
    
    // Verificar que el icono está presente
    const icono = document.querySelector('svg');
    expect(icono).toBeTruthy();
    
    // Verificar que no hay descripción
    expect(screen.queryByText(/No se pudo conectar/i)).not.toBeInTheDocument();
  });

  test('renderiza correctamente con mensaje y descripción', () => {
    const mensaje = 'Error de conexión';
    const descripcion = 'No se pudo conectar al servidor, intente más tarde';
    
    render(<ErrorMessage message={mensaje} description={descripcion} />);
    
    // Verificar que el mensaje se muestra
    expect(screen.getByText(mensaje)).toBeInTheDocument();
    
    // Verificar que la descripción se muestra
    expect(screen.getByText(descripcion)).toBeInTheDocument();
    
    // Verificar que la descripción está dentro de un div que tiene la clase correcta
    const descripcionElement = screen.getByText(descripcion);
    expect(descripcionElement.className).toContain('mt-1');
  });

  test('aplica las clases correctas para estilizar el mensaje de error', () => {
    render(<ErrorMessage message="Error de prueba" />);
    
    // Verificar el contenedor principal (primer div)
    // Usando el selector correcto para encontrar el elemento principal
    const contenedorPrincipal = document.querySelector('.mb-4.bg-red-50');
    expect(contenedorPrincipal).toBeTruthy();
    expect(contenedorPrincipal).toHaveClass('bg-red-50');
    expect(contenedorPrincipal).toHaveClass('dark:bg-red-900/20');
    expect(contenedorPrincipal).toHaveClass('rounded-xl');
    expect(contenedorPrincipal).toHaveClass('border');
    
    // Verificar el texto del mensaje
    const textoMensaje = screen.getByText('Error de prueba');
    expect(textoMensaje).toHaveClass('text-red-800');
    expect(textoMensaje).toHaveClass('dark:text-red-300');
    
    // Verificar el icono
    const icono = document.querySelector('svg');
    expect(icono).toHaveClass('text-red-500');
    expect(icono).toHaveClass('dark:text-red-400');
  });
}); 