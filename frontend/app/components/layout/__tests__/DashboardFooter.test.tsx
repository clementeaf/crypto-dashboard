import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import DashboardFooter from '../DashboardFooter';

describe('DashboardFooter', () => {
  test('se renderiza correctamente con la fecha de última actualización', () => {
    const lastUpdated = '2023-05-28 12:30:00';
    
    render(<DashboardFooter lastUpdated={lastUpdated} />);
    
    // Verificar que el texto estático está presente
    expect(screen.getByText('Crypto Dashboard — Drag the cards to reorganize them')).toBeInTheDocument();
    
    // Verificar que se muestra la fecha de última actualización
    expect(screen.getByText(`Last update: ${lastUpdated}`)).toBeInTheDocument();
  });
  
  test('muestra "N/A" cuando no hay fecha de última actualización', () => {
    render(<DashboardFooter lastUpdated={null} />);
    
    // Verificar que el texto estático está presente
    expect(screen.getByText('Crypto Dashboard — Drag the cards to reorganize them')).toBeInTheDocument();
    
    // Verificar que se muestra "N/A" cuando lastUpdated es null
    expect(screen.getByText('Last update: N/A')).toBeInTheDocument();
  });
  
  test('aplica las clases CSS correctas para el diseño', () => {
    render(<DashboardFooter lastUpdated="2023-05-28 12:30:00" />);
    
    // Verificar que el footer tiene las clases CSS correctas
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-white/70');
    expect(footer).toHaveClass('dark:bg-gray-900/70');
    expect(footer).toHaveClass('backdrop-blur-md');
    expect(footer).toHaveClass('border-t');
    
    // Verificar que el contenedor del texto tiene las clases CSS correctas
    const textContainer = footer.querySelector('div > div');
    expect(textContainer).toHaveClass('text-center');
    expect(textContainer).toHaveClass('text-gray-600');
    expect(textContainer).toHaveClass('dark:text-gray-400');
  });
}); 