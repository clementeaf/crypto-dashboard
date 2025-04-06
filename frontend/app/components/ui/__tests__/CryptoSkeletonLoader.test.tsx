import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import CryptoSkeletonLoader from '../CryptoSkeletonLoader';

describe('CryptoSkeletonLoader', () => {
  test('renderiza el número predeterminado de esqueletos (8) cuando no se proporciona count', () => {
    render(<CryptoSkeletonLoader />);
    
    // Verificar que hay 8 esqueletos renderizados
    const esqueletos = document.querySelectorAll('[class*="animate-pulse"]');
    expect(esqueletos.length).toBe(8);
  });

  test('renderiza el número correcto de esqueletos cuando se proporciona count', () => {
    const countPrueba = 4;
    render(<CryptoSkeletonLoader count={countPrueba} />);
    
    // Verificar que hay exactamente el número especificado de esqueletos
    const esqueletos = document.querySelectorAll('[class*="animate-pulse"]');
    expect(esqueletos.length).toBe(countPrueba);
  });

  test('cada esqueleto tiene la estructura correcta', () => {
    render(<CryptoSkeletonLoader count={1} />);
    
    // Verificar que existe un contenedor principal
    const contenedor = document.querySelector('.grid');
    expect(contenedor).toBeTruthy();
    
    // Verificar que el esqueleto tiene las clases correctas
    const esqueleto = document.querySelector('[class*="animate-pulse"]');
    expect(esqueleto).toHaveClass('relative');
    expect(esqueleto).toHaveClass('bg-white');
    expect(esqueleto).toHaveClass('dark:bg-gradient-to-br');
    expect(esqueleto).toHaveClass('rounded-xl');
    
    // Verificar la estructura interna de un esqueleto
    // - Debe tener un círculo para el icono
    const iconoPlaceholder = document.querySelector('.rounded-full');
    expect(iconoPlaceholder).toBeTruthy();
    
    // - Debe tener placeholders para el texto
    const textosPlaceholder = document.querySelectorAll('[class*="bg-gray-200"]');
    expect(textosPlaceholder.length).toBeGreaterThan(0);
    
    // - Debe tener una sección de precio
    const precioPlaceholder = document.querySelector('.border-t');
    expect(precioPlaceholder).toBeTruthy();
  });

  test('maneja correctamente valores de count diferentes', () => {
    // Probar con un valor mayor
    render(<CryptoSkeletonLoader count={12} />);
    let esqueletos = document.querySelectorAll('[class*="animate-pulse"]');
    expect(esqueletos.length).toBe(12);
    
    // Limpiar
    document.body.innerHTML = '';
    
    // Probar con un valor pequeño
    render(<CryptoSkeletonLoader count={1} />);
    esqueletos = document.querySelectorAll('[class*="animate-pulse"]');
    expect(esqueletos.length).toBe(1);
  });
}); 