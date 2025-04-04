import {
  Links,
  Meta,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useState, useEffect, createContext, useContext } from "react";
import { Amplify } from 'aws-amplify';
import { loadAmplifyConfig } from './utils/amplify-config';

// Importamos el archivo tailwind.css directamente
import "./tailwind.css";

// Definimos el contexto de tema
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Obtenemos la preferencia de tema del usuario
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieTheme = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("theme="));
    
  const theme = cookieTheme ? cookieTheme.split("=")[1] : "light";
  
  // Load Amplify configuration for the client side
  const amplifyConfig = loadAmplifyConfig();
  
  return json({ 
    theme,
    amplifyConfig
  });
};

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
  }
];

// Para evitar problemas de anidamiento, solo tenemos un componente raíz
export default function App() {
  const data = useLoaderData<typeof loader>();
  const initialTheme = ((data?.theme === 'light' || data?.theme === 'dark') ? data.theme : 'light') as Theme;
  const [theme, setTheme] = useState<Theme>(initialTheme);
  
  // Aplicamos protección contra redeclaración de RefreshRuntime
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Configuración global para AWS Amplify
    if (!(window as any).global) (window as any).global = window;
    if (!(window as any).process) {
      (window as any).process = { 
        env: { NODE_ENV: 'production' },
        nextTick: (callback: Function) => setTimeout(callback, 0)
      };
    }
    if (!(window as any).Buffer) {
      (window as any).Buffer = {
        isBuffer: (obj: any) => false,
        from: () => ({}),
        alloc: () => ({})
      };
    }

    // Inicializar Amplify
    if (data.amplifyConfig) {
      Amplify.configure(data.amplifyConfig);
    }
  }, [data.amplifyConfig]);

  // Efecto para aplicar el tema seleccionado
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Guardar preferencia en cookie
    document.cookie = `theme=${theme};path=/;max-age=31536000`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="es" className={theme}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <script dangerouslySetInnerHTML={{
            __html: `
              if (window.RefreshRuntime) {
                window._refreshRuntime = window.RefreshRuntime;
                delete window.RefreshRuntime;
              }
            `
          }} />
        </head>
        <body className="bg-background text-foreground min-h-screen">
          <Outlet />
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
