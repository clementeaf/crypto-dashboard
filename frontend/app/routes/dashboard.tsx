import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import Dashboard from "~/components/layout/Dashboard";
import { getCryptocurrencies } from "~/services/crypto.service";
import type { Cryptocurrency } from "~/types/crypto";
import { useAuth } from "~/context/AuthContext";
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
  
  // Inicializar logger
  const logger = useLogger({
    maxLogs: 100,
    captureConsole: true,
    persistLogs: false
  });
  
  // Revalidator para actualizar los datos
  const revalidator = useRevalidator();
  
  // Estado para la actualización automática
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60); // segundos
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(error || null);
  
  // Referencias
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const loggerRef = useRef(logger);
  
  // Actualizar la referencia del logger cuando cambie
  useEffect(() => {
    loggerRef.current = logger;
  }, [logger]);
  
  // Verificar autenticación del lado del cliente - mayor prioridad
  useEffect(() => {
    if (!isLoggedIn) {
      loggerRef.current.info("Redirigiendo a login por falta de autenticación", "auth");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);
  
  // Función para cerrar sesión
  const handleLogout = useCallback(() => {
    loggerRef.current.info("Usuario cerró sesión", "auth");
    logout();
    navigate("/login");
  }, [navigate, logout]);
  
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
    loggerRef.current.clearLogs();
    // Registrar inicio de actualización
    loggerRef.current.info('Iniciando actualización de datos...', 'refresh');
    // Reiniciar mensaje de error
    setApiErrorMessage(null);
    // Actualizar datos
    revalidator.revalidate();
    // Actualizar la hora de última actualización
    setLastUpdated(new Date().toLocaleTimeString());
  }, [revalidator]);
  
  // Manejar errores de revalidación
  useEffect(() => {
    // Solo procesar el error si estamos en estado 'idle' y hay un error
    if (revalidator.state === 'idle' && error) {
      loggerRef.current.error(`Error en revalidación: ${error}`, 'api');
      
      // Manejar diferentes tipos de errores
      if (typeof error === 'string' && (error.includes('timeout') || error.includes('aborted'))) {
        setApiErrorMessage('La conexión con la API está tardando demasiado tiempo. Mostraremos datos de ejemplo mientras tanto.');
      } else {
        setApiErrorMessage(error);
      }
    }
  }, [revalidator.state, error]);
  
  // Establecer última actualización al cargar por primera vez
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);
  
  // Efecto para manejar la actualización automática
  useEffect(() => {
    // Limpiar cualquier intervalo existente primero
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Solo configurar un nuevo intervalo si autoRefresh está habilitado
    if (autoRefresh) {
      loggerRef.current.info(`[AUTO] Configurando actualización automática cada ${refreshInterval} segundos`, 'refresh');
      intervalRef.current = setInterval(() => {
        loggerRef.current.info('[AUTO] Ejecutando actualización automática', 'refresh');
        handleRefresh();
      }, refreshInterval * 1000);
    }
    
    // Limpiar el intervalo cuando el componente se desmonte o las dependencias cambien
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, handleRefresh]);

  // Memoizar el nombre de usuario
  const username = useMemo(() => {
    return user?.username || 'Usuario';
  }, [user]);

  // Si no está autenticado, mostrar un placeholder mientras redirige
  if (!isLoggedIn) {
    return <div className="bg-gray-100 dark:bg-gray-900 min-h-screen" aria-label="Redirigiendo a la página de login"></div>;
  }

  // Memoizar las props para el componente Dashboard para evitar re-renderizados innecesarios
  return (
    <Dashboard 
      title="Dashboard de Criptomonedas"
      username={username}
      onLogout={handleLogout}
      lastUpdated={lastUpdated}
      onRefresh={handleRefresh}
      autoRefresh={autoRefresh}
      onToggleAutoRefresh={handleToggleAutoRefresh}
      refreshInterval={refreshInterval}
      onChangeRefreshInterval={handleChangeInterval}
      apiError={apiErrorMessage}
      cryptocurrencies={cryptocurrencies}
    />
  );
} 