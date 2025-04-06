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
  
  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            
            {/* Información del usuario y botón de logout */}
            {onLogout && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">
                  {username}
                </span>
                <LoadingButton
                  onClick={onLogout}
                  variant="danger"
                  size="sm"
                >
                  Cerrar sesión
                </LoadingButton>
              </div>
            )}
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isLoading ? 'Actualizando datos...' : 
              lastUpdated ? `Última actualización: ${lastUpdated}` : 
              'Monitor top cryptocurrencies in real-time'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <ThemeToggle />
          </div>
          
          {onToggleAutoRefresh && (
            <AutoRefreshControl
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
              onToggleAutoRefresh={handleToggleAutoRefresh}
              onChangeInterval={handleChangeInterval}
              disabled={isLoading}
            />
          )}
          
          <LoadingButton 
            onClick={handleRefresh}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="sm"
            loadingText="Actualizando..."
          >
            Actualizar datos
          </LoadingButton>
        </div>
      </header>
      
      <div className="w-full max-w-md mb-6">
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
        />
      </div>
      
      {apiError && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800/30">
          <p className="font-medium">{apiError}</p>
          <p className="text-sm">Los datos mostrados son aproximados. Intente actualizando nuevamente en unos minutos.</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Criptomonedas</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            {filteredCryptos.length} de {cryptocurrencies.length}
          </div>
          
          {filteredCryptos.length === 0 && searchTerm.trim() !== '' && (
            <span className="text-sm text-orange-500 dark:text-orange-400">
              No se encontraron resultados
            </span>
          )}
        </div>
      </div>
      
      {isLoading && filteredCryptos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-64 animate-pulse"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCryptos.map((crypto, index) => {
            // Solo paso drag events al contenedor, no al CryptoCard
            return (
              <div
                key={crypto.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                className={`transition-transform ${
                  index === draggedItemIndex ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <CryptoCard 
                  crypto={crypto} 
                  index={index}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 