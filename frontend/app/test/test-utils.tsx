import React, { ReactElement, createContext } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Definimos nuestro propio contexto de tema para pruebas
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Proveedor de contexto de tema para pruebas
interface ThemeProviderProps {
  initialTheme?: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({ initialTheme = 'light', children }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(initialTheme);

  const contextValue = React.useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Opciones extendidas para renderizado personalizado
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: Theme;
}

// Función de renderizado personalizada que incluye el proveedor de tema
export function renderWithProviders(
  ui: ReactElement,
  { initialTheme = 'light', ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-exportar todo de testing-library
export * from '@testing-library/react'; 