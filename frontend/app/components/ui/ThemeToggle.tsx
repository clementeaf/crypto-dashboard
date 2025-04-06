import { useTheme } from '~/root';
import { useEffect, useState } from 'react';

// Función para aplicar el tema directamente al DOM
function applyThemeDirectly(theme: 'light' | 'dark' | 'system') {
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'light') {
    html.classList.remove('dark');
  } else if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Solo después de montarse podemos acceder al tema actual
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Manejador de cambio de tema con doble enfoque (contexto + DOM directo)
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    console.log(`ThemeToggle: Cambiando tema de ${theme} a ${newTheme}`);
    
    // Actualizar el contexto
    setTheme(newTheme);
    
    // Aplicar directamente al DOM para mayor rapidez
    applyThemeDirectly(newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', newTheme);
    
    console.log(`ThemeToggle: Tema actualizado a ${newTheme}`);
  };
  
  if (!mounted) {
    // Renderizar un placeholder mientras se carga para evitar hidratación incorrecta
    return (
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner min-w-[144px] h-[40px]"></div>
    );
  }
  
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner select-none">
      <button 
        onClick={() => handleThemeChange('light')}
        className={`flex items-center justify-center p-2 rounded-md text-sm transition-all ${
          theme === 'light' 
            ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm font-medium' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Modo claro"
        title="Modo claro"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline ml-1.5">Claro</span>
      </button>
      
      <button
        onClick={() => handleThemeChange('dark')}
        className={`flex items-center justify-center p-2 rounded-md text-sm transition-all ${
          theme === 'dark'
            ? 'bg-gray-900 text-blue-400 shadow-sm font-medium' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Modo oscuro"
        title="Modo oscuro"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <span className="hidden sm:inline ml-1.5">Oscuro</span>
      </button>
    </div>
  );
} 