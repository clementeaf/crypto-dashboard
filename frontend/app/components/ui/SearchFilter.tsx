import { useRef, useState, useEffect } from 'react';
import { useTheme } from '~/root';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchFilter({ 
  searchTerm, 
  setSearchTerm, 
  isLoading = false,
  placeholder = "Search cryptocurrency by name or symbol..."
}: SearchFilterProps) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Effect to auto-focus when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <div className={`grok-search relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        className="w-full py-3 pl-12 pr-12 rounded-lg border 
          bg-white dark:bg-gray-800/70 
          text-gray-900 dark:text-white 
          placeholder:text-gray-500 dark:placeholder:text-gray-500 
          border-gray-300 dark:border-gray-700 
          focus:outline-none focus:ring-0
          transition-all"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
      />
      
      {searchTerm ? (
        <button 
          className="absolute inset-y-0 right-0 flex items-center pr-4 
            text-gray-500 dark:text-gray-400 
            hover:text-gray-700 dark:hover:text-gray-300 
            transition-colors"
          onClick={() => setSearchTerm('')}
          aria-label="Clear search"
          title="Clear search"
        >
          <svg 
            className="w-5 h-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      ) : isLoading ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <div className="w-5 h-5 border-2 
            border-gray-300/30 dark:border-gray-700/30 
            border-t-gray-500 dark:border-t-gray-500 
            rounded-full animate-spin"></div>
        </div>
      ) : null}
    </div>
  );
} 