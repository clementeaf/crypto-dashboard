import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
import { useCallback, useState, useEffect, useRef } from "react";
import Dashboard from "~/components/layout/Dashboard";
import { getCryptocurrencies, clearCache } from "~/services/crypto.service";
import { testApiConnection } from "~/services/api.config";
import type { Cryptocurrency } from "~/types/crypto";
import { useAuth } from "~/context/AuthContext";
import { useTheme } from "~/root";
import { useLogger } from "~/hooks/useLogger";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Crypto Dashboard" },
    { name: "description", content: "Dashboard de criptomonedas en tiempo real" },
  ];
};

// Datos de respaldo en caso de fallo de API
const FALLBACK_DATA: Cryptocurrency[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://cryptoicons.org/api/icon/btc/200",
    current_price: {
      usd: 65000,
      btc: 1
    },
    price_change_percentage_24h: 2.5,
    market_cap: 1258000000000,
    total_volume: 38000000000,
    circulating_supply: 19000000
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://cryptoicons.org/api/icon/eth/200",
    current_price: {
      usd: 3500,
      btc: 0.054
    },
    price_change_percentage_24h: 3.2,
    market_cap: 420000000000,
    total_volume: 15000000000,
    circulating_supply: 120000000
  }
];

// Verificar autenticación en el loader (lado del servidor)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // No podemos verificar isAuthenticated() en el servidor porque usa sessionStorage
  // Sin embargo, en una app real verificaríamos la cookie de sesión aquí
  
  try {
    // Intentar obtener datos reales
    const cryptocurrencies = await getCryptocurrencies(10);
    
    return json({ 
      cryptocurrencies, 
      error: null 
    });
  } catch (error) {
    console.error("Error en el loader:", error);
    
    // Devolver datos de respaldo en caso de error
    return json({ 
      cryptocurrencies: FALLBACK_DATA,
      error: "No se pudieron cargar los datos en tiempo real. Mostrando datos de ejemplo."
    });
  }
};

export default function DashboardRoute() {
  const navigate = useNavigate();
  const { cryptocurrencies, error } = useLoaderData<typeof loader>();
  
  // Usar AuthContext
  const { user, isLoggedIn, logout } = useAuth();
  
  // Usar ThemeContext
  const { isDark } = useTheme();
  
  // Verificar autenticación del lado del cliente
  useEffect(() => {
    // Verificación más estricta
    if (!isLoggedIn) {
      console.log("Usuario no autenticado, redirigiendo a login");
      navigate("/login", { replace: true });
      return;
    } else {
      console.log("Usuario autenticado:", user);
    }
  }, [isLoggedIn, navigate, user]);
  
  // Si no está autenticado, no renderizar nada mientras redirige
  if (!isLoggedIn) {
    console.log("No autenticado, renderizando nada mientras redirige");
    return <div className="bg-gray-100 dark:bg-gray-900 min-h-screen"></div>;
  }
  
  // Obtener revalidator para actualizar los datos
  const revalidator = useRevalidator();
  
  // Usar el hook personalizado de logging
  const logger = useLogger({
    maxLogs: 100,
    captureConsole: true,
    persistLogs: false
  });
  
  // Estado para controles de UI
  const [showLogs, setShowLogs] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{
    success?: boolean;
    data?: any;
    error?: string;
    statusCode?: number;
    responseTime?: number;
    timestamp?: string;
  } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  
  // Estado para la actualización automática
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60); // segundos
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Función para cerrar sesión
  const handleLogout = useCallback(() => {
    logger.info("Usuario cerró sesión", "auth");
    logout();
    navigate("/login");
  }, [navigate, logout, logger]);
  
  // Función para limpiar la caché
  const handleClearCache = useCallback(() => {
    setIsClearingCache(true);
    logger.info('Limpiando caché...', 'cache');
    
    try {
      clearCache();
      logger.info('Caché limpiada correctamente', 'cache');
    } catch (error) {
      logger.error(`Error al limpiar la caché: ${error}`, 'cache');
    } finally {
      setIsClearingCache(false);
    }
  }, [logger]);
  
  // Función para probar la API
  const handleTestApi = async () => {
    setIsTestingApi(true);
    logger.info('Iniciando prueba de conexión con la API...', 'api');
    
    try {
      const result = await testApiConnection();
      logger.info('Resultado de la prueba de conexión:', 'api');
      
      setApiTestResult({
        ...result,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      logger.error(`Error al ejecutar la prueba de conexión: ${err}`, 'api');
      
      setApiTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTestingApi(false);
    }
  };
  
  // Toggle para actualización automática
  const handleToggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);
  
  // Cambiar intervalo de actualización
  const handleChangeInterval = useCallback((interval: number) => {
    setRefreshInterval(interval);
  }, []);
  
  // Callback para actualizar los datos
  const handleRefresh = useCallback(() => {
    // Limpiar logs previos
    logger.clearLogs();
    // Registrar inicio de actualización
    logger.info('Iniciando actualización de datos...', 'refresh');
    // Actualizar datos
    revalidator.revalidate();
    // Actualizar la hora de última actualización
    setLastUpdated(new Date().toLocaleTimeString());
  }, [revalidator, logger]);
  
  // Establecer última actualización al cargar por primera vez
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);
  
  // Efecto para manejar la actualización automática
  useEffect(() => {
    // Limpiar cualquier intervalo existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Si autoRefresh está habilitado, configurar el intervalo
    if (autoRefresh) {
      logger.info(`[AUTO] Configurando actualización automática cada ${refreshInterval} segundos`, 'refresh');
      intervalRef.current = setInterval(() => {
        logger.info('[AUTO] Ejecutando actualización automática', 'refresh');
        handleRefresh();
      }, refreshInterval * 1000);
    }
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, handleRefresh, logger]);

  return (
    <Dashboard 
      title="Dashboard de Criptomonedas"
      username={user?.username || 'Usuario'}
      onLogout={handleLogout}
      lastUpdated={lastUpdated}
      onRefresh={handleRefresh}
      autoRefresh={autoRefresh}
      onToggleAutoRefresh={handleToggleAutoRefresh}
      refreshInterval={refreshInterval}
      onChangeRefreshInterval={handleChangeInterval}
      apiError={error}
      cryptocurrencies={cryptocurrencies}
    />
  );
} 