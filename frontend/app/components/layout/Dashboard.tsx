import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@remix-run/react';
import CryptoCard from '~/components/cards/CryptoCard';
import SearchFilter from '~/components/ui/SearchFilter';
import ThemeToggle from '~/components/ui/ThemeToggle';
import type { Cryptocurrency } from '~/types/crypto';
import { getTimeSinceLastRefresh, setLastRefreshTime, getCardOrder, saveCardOrder } from '~/utils/storage';
import LoadingButton from '~/components/ui/LoadingButton';
import AutoRefreshControl from '~/components/ui/AutoRefreshControl';

interface DashboardProps {
  cryptocurrencies: Cryptocurrency[];
  onRefresh: () => void;
  apiError?: string | null;
  title?: string;
  username?: string;
  onLogout?: () => void;
  lastUpdated?: string | null;
  autoRefresh?: boolean;
  onToggleAutoRefresh?: () => void;
  refreshInterval?: number;
  onChangeRefreshInterval?: (interval: number) => void;
}

export default function Dashboard({ 
  cryptocurrencies, 
  onRefresh, 
  apiError,
  title = "Crypto Dashboard",
  username = "Usuario",
  onLogout,
  lastUpdated,
  autoRefresh = false,
  onToggleAutoRefresh,
  refreshInterval = 60,
  onChangeRefreshInterval
}: DashboardProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const [timeSinceRefresh, setTimeSinceRefresh] = useState<number | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(autoRefresh);
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>(cryptocurrencies);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Sincronizar el estado local con el prop
  useEffect(() => {
    setIsAutoRefreshEnabled(autoRefresh);
  }, [autoRefresh]);
  
  // Update cryptos when cryptocurrencies prop changes, respecting saved order
  useEffect(() => {
    // Solo intentamos ordenar si hay criptomonedas
    if (cryptocurrencies.length === 0) {
      setCryptos([]);
      return;
    }
    
    // Intentamos obtener el orden guardado de localStorage
    const savedOrder = getCardOrder();
    
    if (savedOrder && savedOrder.length > 0) {
      // Creamos un mapa para acceso rápido a las criptomonedas por id
      const cryptoMap = new Map<string, Cryptocurrency>();
      cryptocurrencies.forEach(crypto => cryptoMap.set(crypto.id, crypto));
      
      // Creamos un nuevo array ordenado basado en los IDs guardados
      const orderedCryptos: Cryptocurrency[] = [];
      
      // Primero agregamos las criptomonedas que tienen un orden guardado
      savedOrder.forEach(id => {
        const crypto = cryptoMap.get(id);
        if (crypto) {
          orderedCryptos.push(crypto);
          cryptoMap.delete(id);
        }
      });
      
      // Luego agregamos cualquier criptomoneda nueva que no estaba en el orden guardado
      cryptoMap.forEach(crypto => {
        orderedCryptos.push(crypto);
      });
      
      setCryptos(orderedCryptos);
    } else {
      // Si no hay orden guardado, usamos el orden predeterminado
      setCryptos(cryptocurrencies);
    }
  }, [cryptocurrencies]);
  
  // Filter cryptocurrencies based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCryptos(cryptos);
      return;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(normalizedSearchTerm) || 
      crypto.symbol.toLowerCase().includes(normalizedSearchTerm)
    );
    
    setFilteredCryptos(filtered);
  }, [cryptos, searchTerm]);
  
  // Format time since last refresh
  const formatTimeSinceRefresh = () => {
    if (timeSinceRefresh === null) return 'N/A';
    
    if (timeSinceRefresh < 60) {
      return `${timeSinceRefresh}s`;
    }
    
    const minutes = Math.floor(timeSinceRefresh / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };
  
  // Update time since last refresh
  useEffect(() => {
    if (isLoading) return;
    
    const updateTime = () => {
      const time = getTimeSinceLastRefresh();
      setTimeSinceRefresh(time);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 10000);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  // Handle auto-refresh usando props externos
  useEffect(() => {
    if (!isAutoRefreshEnabled || !onToggleAutoRefresh) return;
    
    const interval = setInterval(() => {
      onRefresh();
      setLastRefreshTime();
    }, (refreshInterval || 60) * 1000);
    
    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, onRefresh, refreshInterval]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    onRefresh();
    setLastRefreshTime();
  }, [onRefresh]);
  
  // Toggle interno/externo de auto-refresh
  const handleToggleAutoRefresh = useCallback(() => {
    if (onToggleAutoRefresh) {
      onToggleAutoRefresh();
    } else {
      setIsAutoRefreshEnabled(prev => !prev);
    }
  }, [onToggleAutoRefresh]);
  
  // Cambio interno/externo de intervalo
  const handleChangeInterval = useCallback((interval: number) => {
    if (onChangeRefreshInterval) {
      onChangeRefreshInterval(interval);
    }
  }, [onChangeRefreshInterval]);
  
  // Guardar el orden actual en localStorage
  const saveCurrentOrder = useCallback((newCryptos: Cryptocurrency[]) => {
    const cryptoIds = newCryptos.map(crypto => crypto.id);
    saveCardOrder(cryptoIds);
  }, []);
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Create a copy of the current crypto list
    const newCryptos = [...cryptos];
    
    // Get the item that is being dragged
    const draggedItem = newCryptos[draggedItemIndex];
    
    // Remove it from the array
    newCryptos.splice(draggedItemIndex, 1);
    
    // Add it at the new position
    newCryptos.splice(index, 0, draggedItem);
    
    // Update the state with the new array
    setCryptos(newCryptos);
    
    // Guardar el nuevo orden en localStorage
    saveCurrentOrder(newCryptos);
    
    // Update the dragged item index
    setDraggedItemIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Alternar menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Barra de navegación superior con efecto de vidrio */}
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
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualizar</span>
                    </>
                  )}
                </button>
                
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all shadow-sm"
                  >
                    Cerrar sesión
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
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualizar</span>
                    </>
                  )}
                </button>
                
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all shadow-sm text-center"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Panel de bienvenida con stats generales */}
        <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Bienvenido al Dashboard</h2>
                  <div className="ml-3 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {username}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Actualizando...</span>
                      </div>
                    ) : lastUpdated ? (
                      <span>Actualizado: {lastUpdated}</span>
                    ) : null}
                  </div>
                  
                  {onToggleAutoRefresh && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <AutoRefreshControl
                        autoRefresh={autoRefresh}
                        refreshInterval={refreshInterval}
                        onToggleAutoRefresh={handleToggleAutoRefresh}
                        onChangeInterval={handleChangeInterval}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Visualiza y analiza las principales criptomonedas en tiempo real
                </p>
                
                {/* Stats flexibles */}
                <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Monedas</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{cryptocurrencies.length}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Monitoreadas</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{filteredCryptos.length}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Auto-refresh</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{autoRefresh ? 'Activado' : 'Desactivado'}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Intervalo</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{refreshInterval}s</div>
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 w-full md:w-1/3 xl:w-1/4 mt-3 md:mt-0">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700/50 shadow-inner">
                  <SearchFilter 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isLoading}
                    placeholder="Buscar criptomoneda..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mensajes de error */}
        {apiError && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-200 dark:border-red-500/30">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{apiError}</h3>
                <div className="mt-1 text-xs text-red-700 dark:text-red-300/80">
                  Los datos mostrados pueden no ser precisos. Intente actualizar en unos minutos.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Grid de criptomonedas con efecto de cristal */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Criptomonedas</h2>
          
          <div className="flex items-center gap-2">
            {filteredCryptos.length === 0 && searchTerm.trim() !== '' && (
              <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                No se encontraron resultados
              </span>
            )}
          </div>
        </div>
        
        {isLoading && filteredCryptos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index} 
                className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg overflow-hidden h-56 sm:h-64 animate-pulse"
              >
                <div className="p-3 sm:p-5 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 dark:bg-gray-700/50 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-4/5"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-3/5"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredCryptos.map((crypto, index) => (
              <div
                key={crypto.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                className={`transition-all duration-300 transform hover:-translate-y-1 ${
                  index === draggedItemIndex ? 'opacity-50 scale-105' : 'opacity-100'
                }`}
              >
                <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg overflow-hidden hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/10">
                  <div className="absolute top-0 left-0 w-full h-1">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  </div>
                  <div className="p-3 sm:p-5">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="mr-2 sm:mr-3">
                        <img src={crypto.image} alt={crypto.symbol} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{crypto.name}</h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{crypto.symbol.toUpperCase()}</span>
                      </div>
                      <div className="ml-auto">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        ${crypto.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h4>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700/30">
                      <div className="grid grid-cols-1 gap-y-2 sm:gap-y-3">
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Precio (BTC)
                          </div>
                          <div className="text-sm sm:font-medium text-gray-700 dark:text-gray-300">
                            {crypto.current_price.btc.toLocaleString(undefined, { 
                              minimumFractionDigits: crypto.current_price.btc < 0.001 ? 8 : 6, 
                              maximumFractionDigits: crypto.current_price.btc < 0.001 ? 8 : 6
                            })} BTC
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer con efectos de vidrio */}
      <footer className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-6 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            <p>Crypto Dashboard — Arrastra las tarjetas para reorganizarlas</p>
            <p className="mt-1">Última actualización: {lastUpdated}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 