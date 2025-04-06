import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

type LogLevel = 'log' | 'error' | 'warn' | 'info';

type LogEntry = {
  message: string;
  type: LogLevel;
  timestamp: string;
  source?: string;
};

type UseLoggerOptions = {
  maxLogs?: number;
  captureConsole?: boolean;
  sources?: string[];
  persistLogs?: boolean;
};

type ConsoleMethods = {
  [K in LogLevel]: typeof console[K]
};

/**
 * Hook personalizado para manejar logging en la aplicación
 * @param options Opciones de configuración
 * @returns Funciones y estado para manejar logs
 */
export function useLogger(options: UseLoggerOptions = {}) {
  const {
    maxLogs = 100,
    captureConsole = false,
    sources = [],
    persistLogs = false,
  } = options;

  // Usar useRef para evitar recrear funciones en cada render
  const optionsRef = useRef({ maxLogs, captureConsole, sources, persistLogs });
  
  // Actualizar refs cuando cambien las opciones
  useEffect(() => {
    optionsRef.current = { maxLogs, captureConsole, sources, persistLogs };
  }, [maxLogs, captureConsole, sources.join(','), persistLogs]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Referencia para funciones originales de consola
  const originalConsoleRef = useRef<ConsoleMethods>();

  // Añadir una entrada de log
  const addLog = useCallback((message: any, type: LogLevel = 'log', source?: string) => {
    const entry: LogEntry = {
      message: typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message),
      type,
      timestamp: new Date().toISOString(),
      source
    };

    setLogs(prev => {
      const newLogs = [entry, ...prev].slice(0, optionsRef.current.maxLogs);
      
      // Persistir logs si está habilitado
      if (optionsRef.current.persistLogs) {
        try {
          localStorage.setItem('app_logs', JSON.stringify(newLogs));
        } catch (error) {
          // Silenciar errores de localStorage
        }
      }
      
      return newLogs;
    });
    
    return entry;
  }, []);

  // Métodos para diferentes tipos de logs - memoizados para estabilidad
  const log = useCallback((message: any, source?: string) => addLog(message, 'log', source), [addLog]);
  const error = useCallback((message: any, source?: string) => addLog(message, 'error', source), [addLog]);
  const warn = useCallback((message: any, source?: string) => addLog(message, 'warn', source), [addLog]);
  const info = useCallback((message: any, source?: string) => addLog(message, 'info', source), [addLog]);

  // Limpiar todos los logs
  const clearLogs = useCallback(() => {
    setLogs([]);
    if (optionsRef.current.persistLogs) {
      try {
        localStorage.removeItem('app_logs');
      } catch (error) {
        // Silenciar errores de localStorage
      }
    }
  }, []);

  // Referencias a las funciones de logging para usar en los overrides
  const logFunctionsRef = useRef({ log, error, warn, info });
  
  // Actualizar referencias cuando cambien las funciones
  useEffect(() => {
    logFunctionsRef.current = { log, error, warn, info };
  }, [log, error, warn, info]);

  // Función helper para crear override de consola - evita duplicación de código
  const createConsoleOverride = useCallback((method: LogLevel) => {
    const originalMethod = originalConsoleRef.current![method];
    
    // Flag para prevenir recursión
    let isLogging = false;
    
    return (...args: any[]) => {
      if (isLogging) {
        // Si ya estamos logeando, llamar al método original para evitar bucles
        originalMethod(...args);
        return;
      }
      
      isLogging = true;
      originalMethod(...args);
      
      try {
        // Usar la referencia más reciente a la función log
        logFunctionsRef.current[method](
          args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
        );
      } finally {
        isLogging = false;
      }
    };
  }, []);

  // Capturar console.log, console.error, etc. - Refactorizado para evitar duplicación
  useEffect(() => {
    // Solo hacer override si captureConsole es true y no lo hemos hecho antes
    if (!captureConsole || originalConsoleRef.current) return;
    
    // Guardar los métodos originales
    originalConsoleRef.current = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    // Aplicar overrides usando la función helper
    console.log = createConsoleOverride('log');
    console.error = createConsoleOverride('error');
    console.warn = createConsoleOverride('warn');
    console.info = createConsoleOverride('info');

    // Restaurar los métodos originales cuando se desmonte el componente
    return () => {
      if (originalConsoleRef.current) {
        console.log = originalConsoleRef.current.log;
        console.error = originalConsoleRef.current.error;
        console.warn = originalConsoleRef.current.warn;
        console.info = originalConsoleRef.current.info;
        originalConsoleRef.current = undefined;
      }
    };
  }, [captureConsole, createConsoleOverride]);

  // Cargar logs persistentes si está habilitado (solo una vez al inicio)
  useEffect(() => {
    if (persistLogs) {
      try {
        const storedLogs = localStorage.getItem('app_logs');
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs) as LogEntry[];
          setLogs(parsedLogs);
        }
      } catch (error) {
        // Silenciar errores de localStorage
      }
    }
  }, [persistLogs]);

  // Memoizar la función filterLogs para estabilidad
  const filterLogs = useCallback((filterFn: (log: LogEntry) => boolean) => {
    return logs.filter(filterFn);
  }, [logs]);

  // Memoizar filtros comunes
  const getErrorLogs = useCallback(() => filterLogs(log => log.type === 'error'), [filterLogs]);
  const getWarningLogs = useCallback(() => filterLogs(log => log.type === 'warn'), [filterLogs]);
  const getInfoLogs = useCallback(() => filterLogs(log => log.type === 'info'), [filterLogs]);
  
  const getLogsBySource = useCallback((source: string) => 
    filterLogs(log => log.source === source), [filterLogs]);

  // Memoizar el objeto de retorno para evitar renderizados innecesarios
  return useMemo(() => ({
    logs,
    addLog,
    log,
    error,
    warn,
    info,
    clearLogs,
    filterLogs,
    getErrorLogs,
    getWarningLogs,
    getInfoLogs,
    getLogsBySource
  }), [
    logs,
    addLog,
    log,
    error,
    warn,
    info,
    clearLogs,
    filterLogs,
    getErrorLogs,
    getWarningLogs,
    getInfoLogs,
    getLogsBySource
  ]);
} 