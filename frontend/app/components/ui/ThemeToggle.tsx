import { useEffect, useState } from 'react';
import { saveThemePreference, getThemePreference } from '~/utils/storage';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  
  // Load theme when component mounts
  useEffect(() => {
    setMounted(true);
    const savedTheme = getThemePreference();
    setTheme(savedTheme);
  }, []);
  
  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'dark-auto');
    
    saveThemePreference(theme);
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme === 'dark' ? 'dark-auto' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);
  
  // Avoid server-side rendering to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <div className="flex items-center bg-secondary/50 rounded-full p-1 shadow-inner">
      <button
        onClick={() => setTheme('light')}
        className={`relative p-1.5 rounded-full transition-all duration-200 ease-in-out ${
          theme === 'light' 
            ? 'bg-white text-black shadow-sm translate-y-[-1px]' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`relative p-1.5 rounded-full transition-all duration-200 ease-in-out ${
          theme === 'dark' 
            ? 'bg-primary text-white shadow-sm translate-y-[-1px]' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`relative p-1.5 rounded-full transition-all duration-200 ease-in-out ${
          theme === 'system' 
            ? 'bg-secondary text-foreground shadow-sm translate-y-[-1px]' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
        aria-label="Use system settings"
        title="Use system settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
} 