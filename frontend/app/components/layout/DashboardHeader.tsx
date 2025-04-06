import { useState } from 'react';
import ThemeToggle from '~/components/ui/ThemeToggle';

interface DashboardHeaderProps {
  title: string;
  isLoading: boolean;
  onRefresh: () => void;
  onLogout?: () => void;
}

export default function DashboardHeader({ 
  title, 
  isLoading, 
  onRefresh, 
  onLogout 
}: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </span>
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <button 
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
          
          {/* Menú escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
              
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Update</span>
                  </>
                )}
              </button>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all shadow-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between items-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                <ThemeToggle />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Update</span>
                  </>
                )}
              </button>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all shadow-sm text-center"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 