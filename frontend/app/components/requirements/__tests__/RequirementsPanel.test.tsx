import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import RequirementsPanel from '../RequirementsPanel';

describe('RequirementsPanel', () => {
  test('se renderiza correctamente con todos los requisitos', () => {
    const onClose = vi.fn();
    render(<RequirementsPanel onClose={onClose} />);
    
    // Verificar que el título está presente
    expect(screen.getByText('Requisitos cumplidos')).toBeInTheDocument();
    
    // Verificar que las secciones principales de requisitos están presentes
    expect(screen.getByText(/✅ Lista de criptomonedas:/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Información por tarjeta:/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Actualización de datos:/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Estados de interfaz:/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Medidas de optimización:/)).toBeInTheDocument();
    expect(screen.getByText(/✅ Sistema de autenticación:/)).toBeInTheDocument();
    
    // Verificar elementos específicos en cada sección
    expect(screen.getByText(/Mostrando hasta 10 criptomonedas populares/)).toBeInTheDocument();
    expect(screen.getByText('Nombre y símbolo de la criptomoneda')).toBeInTheDocument();
    expect(screen.getByText('Tipo de cambio actual a USD')).toBeInTheDocument();
    expect(screen.getByText('Tipo de cambio actual a Bitcoin (BTC)')).toBeInTheDocument();
    expect(screen.getByText('Estado de carga con indicadores visuales')).toBeInTheDocument();
    expect(screen.getByText('Sistema de caché para reducir solicitudes a la API (5 minutos de duración)')).toBeInTheDocument();
    expect(screen.getByText('Login con nombre de usuario y contraseña (admin/admin)')).toBeInTheDocument();
    
    // Verificar que la nota está presente
    expect(screen.getByText(/Nota:/, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/La API de Coinbase tiene límites de solicitudes/, { exact: false })).toBeInTheDocument();
  });
  
  test('llama a onClose cuando se hace clic en el botón de cerrar', () => {
    const onClose = vi.fn();
    render(<RequirementsPanel onClose={onClose} />);
    
    // Encontrar el botón de cerrar por su aria-label
    const closeButton = screen.getByLabelText('Cerrar panel de requisitos');
    
    // Simular clic en el botón
    fireEvent.click(closeButton);
    
    // Verificar que onClose fue llamado
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  
  test('aplica las clases CSS correctas para el tema claro', () => {
    const onClose = vi.fn();
    const { container } = render(<RequirementsPanel onClose={onClose} />);
    
    // Verificar las clases principales del panel (primer div del documento)
    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass('mb-6');
    expect(panel).toHaveClass('p-4');
    expect(panel).toHaveClass('bg-green-50');
    expect(panel).toHaveClass('rounded-lg');
    expect(panel).toHaveClass('border');
    expect(panel).toHaveClass('border-green-200');
    
    // Verificar las clases del título
    const title = screen.getByText('Requisitos cumplidos');
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-green-800');
    
    // Verificar las clases del botón de cerrar
    const closeButton = screen.getByLabelText('Cerrar panel de requisitos');
    expect(closeButton).toHaveClass('text-green-600');
    expect(closeButton).toHaveClass('hover:text-green-800');
  });
}); 