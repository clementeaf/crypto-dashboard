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
import { createContext, useContext, useState, useEffect } from "react";
import { AuthProvider } from "~/context/AuthContext";

// Importar CSS como side effect
import "./tailwind.css";

// Tema simple - solo necesitamos true/false para dark mode
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

// Crear contexto simple de tema
export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

// Hook simple para usar el tema
export function useTheme() {
  return useContext(ThemeContext);
}

// Proveedor simple de tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  
  // Toggle simple entre claro/oscuro
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Aplicar cambio directamente al HTML
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar en localStorage
    localStorage.setItem('isDark', String(newIsDark));
  };
  
  // Cargar preferencia al inicio
  useEffect(() => {
    const savedIsDark = localStorage.getItem('isDark');
    
    // Si hay una preferencia guardada, usarla
    if (savedIsDark !== null) {
      const parsedIsDark = savedIsDark === 'true';
      setIsDark(parsedIsDark);
      
      // Aplicar tema guardado
      if (parsedIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Por defecto, usar tema oscuro
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
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
        {/* Script para prevenir parpadeo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isDark = localStorage.getItem('isDark');
                  if (isDark === 'true' || isDark === null) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
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
