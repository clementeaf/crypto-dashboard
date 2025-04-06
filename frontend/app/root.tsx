import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { AuthProvider } from "~/context/AuthContext";

// Importar CSS como side effect
import "./tailwind.css";

// Definir tipos para el tema
type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Crear el contexto de tema
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook para usar el contexto de tema
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}

// Función para obtener el tema del localStorage si existe
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  
  return (localStorage.getItem('theme') as Theme) || 'system';
}

// Función para aplicar el tema al elemento HTML
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  console.log("root.tsx: Aplicando tema directamente al DOM:", theme);
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
  
  // Guardar en localStorage para mantener la consistencia
  try {
    localStorage.setItem('theme', theme);
    console.log("root.tsx: Tema guardado en localStorage:", theme);
  } catch (e) {
    console.error("Error al guardar tema en localStorage:", e);
  }
}

// Componente proveedor del tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const initialThemeApplied = useRef(false);

  // Actualizar el estado con el tema guardado cuando el componente se monta
  useEffect(() => {
    const savedTheme = getStoredTheme();
    console.log("ThemeProvider: Tema obtenido de localStorage:", savedTheme);
    setTheme(savedTheme);
    setMounted(true);
    
    // Aplicar tema inicial inmediatamente
    if (!initialThemeApplied.current) {
      console.log("ThemeProvider: Aplicando tema inicial al DOM:", savedTheme);
      applyTheme(savedTheme);
      initialThemeApplied.current = true;
    }
  }, []);

  // Manejador para cambiar el tema
  const handleSetTheme = (newTheme: Theme) => {
    console.log("ThemeProvider: Cambiando tema a:", newTheme);
    
    // Actualizar estado
    setTheme(newTheme);
    
    // Aplicar al DOM y guardar en localStorage
    applyTheme(newTheme);
  };

  // Aplicar clases al elemento html cuando cambia el tema
  useEffect(() => {
    if (!mounted) return;
    
    console.log("ThemeProvider: Tema actualizado en el contexto:", theme);
    
    // Manejar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        console.log("ThemeProvider: Detectado cambio en preferencia del sistema");
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Usar una URL relativa al archivo CSS
export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    {
      name: "description",
      content: "Dashboard en tiempo real para visualizar información de criptomonedas",
    },
  ];
};

export default function App() {
  return (
    <html lang="es" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* Script para prevenir parpadeo al cargar la página */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  console.log("Script inline: Aplicando tema inicial:", theme);
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error("Error en script inline de tema:", e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Error Boundary para manejo de errores a nivel de aplicación
export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.";
  let title = "Error";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    message = error.data.message || error.data;
    title = `Error ${error.status}`;
    status = error.status;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">{title}</h1>
              <div className="mb-6 text-lg text-gray-600 dark:text-gray-300">{message}</div>
              <a 
                href="/"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
