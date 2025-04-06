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

// Import CSS as side effect
import "./tailwind.css";

// Simple theme - we only need true/false for dark mode
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

// Create simple theme context
export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

// Simple hook to use the theme
export function useTheme() {
  return useContext(ThemeContext);
}

// Simple theme provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  
  // Simple toggle between light/dark
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Apply change directly to HTML
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('isDark', String(newIsDark));
  };
  
  // Load preference at startup
  useEffect(() => {
    const savedIsDark = localStorage.getItem('isDark');
    
    // If there's a saved preference, use it
    if (savedIsDark !== null) {
      const parsedIsDark = savedIsDark === 'true';
      setIsDark(parsedIsDark);
      
      // Apply saved theme
      if (parsedIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // By default, use dark theme
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Use a relative URL to the CSS file
export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    {
      name: "description",
      content: "Real-time dashboard for cryptocurrency information",
    },
  ];
};

// Function to determine if we should use dark mode by default
// This ensures that the server and client have the same initial class
function getInitialDarkMode(): boolean {
  // On the server, we always assume dark mode by default
  if (typeof window === 'undefined') return true;
  
  // On the client, we check localStorage
  try {
    const storedValue = localStorage.getItem('isDark');
    return storedValue === null || storedValue === 'true';
  } catch (e) {
    return true; // By default we use dark mode
  }
}

// We use a variable to determine if we add the 'dark' class by default
const initialIsDark = getInitialDarkMode();

export default function App() {
  return (
    <html lang="en" className={`h-full${initialIsDark ? ' dark' : ''}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* Script to prevent flicker */}
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

// Error Boundary for application-level error handling
export function ErrorBoundary() {
  const error = useRouteError();
  let message = "An unexpected error occurred. Please try again later.";
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
    <html lang="en" className="h-full dark">
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
                Back to Homepage
              </a>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
