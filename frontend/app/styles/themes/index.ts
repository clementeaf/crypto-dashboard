// Índice de exportación para todos los temas
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

// Exportamos todos los temas juntos
export const theme = {
  colors,
  ...typography,
  ...spacing,
  
  // Extensiones adicionales
  extend: {
    borderRadius: {
      'card': '0.75rem',
    },
    boxShadow: {
      'card': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    animation: {
      'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  },
};

// Exportación individual para facilitar la importación
export { colors, typography, spacing }; 