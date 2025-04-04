import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useState, useEffect } from "react";

// Importamos nuestro archivo principal de estilos en lugar de tailwind.css
import "./styles/index.css";

// Obtenemos la preferencia de tema del usuario
export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieTheme = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("theme="));
    
  const theme = cookieTheme ? cookieTheme.split("=")[1] : "system";
  
  return json({ theme });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
  },
];

// Función para detectar si el sistema está en modo oscuro
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData<typeof loader>();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(
    theme as 'light' | 'dark' | 'system'
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Efecto para aplicar el tema seleccionado
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'dark-auto');

    let effectiveTheme: 'light' | 'dark';
    if (themeMode === 'system') {
      effectiveTheme = getSystemTheme();
      root.classList.add('dark-auto');
    } else {
      effectiveTheme = themeMode;
      root.classList.add(themeMode);
    }
    
    setResolvedTheme(effectiveTheme);

    // Guardar preferencia en cookie
    document.cookie = `theme=${themeMode};path=/;max-age=31536000`;
    
    // Escuchar cambios en el tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themeMode]);

  return (
    <html lang="es" className={resolvedTheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
