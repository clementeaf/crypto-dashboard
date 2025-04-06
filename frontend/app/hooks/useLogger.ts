import { useState, useEffect, useCallback, useRef } from 'react';

type LogEntry = {
  message: string;
  type: 'log' | 'error' | 'warn' | 'info';
  timestamp: string;
  source?: string;
};

type UseLoggerOptions = {
  maxLogs?: number;
  captureConsole?: boolean;
  sources?: string[];
  persistLogs?: boolean;
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
  const originalConsoleRef = useRef<{
    log: typeof console.log,
    error: typeof console.error,
    warn: typeof console.warn,
    info: typeof console.info
  }>();

  // Añadir una entrada de log
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'log', source?: string) => {
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

  // Métodos para diferentes tipos de logs - ahora son estables entre renders
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

  // Capturar console.log, console.error, etc. - Ahora con control para evitar bucles
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

    // Flag para prevenir recursión
    let isLogging = false;
    
    // Override para console.log
    console.log = (...args) => {
      if (isLogging) {
        // Si ya estamos logeando, llamar al método original para evitar bucles
        originalConsoleRef.current!.log(...args);
        return;
      }
      
      isLogging = true;
      originalConsoleRef.current!.log(...args);
      
      try {
        // Usar la referencia más reciente a la función log
        logFunctionsRef.current.log(
          args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
        );
      } finally {
        isLogging = false;
      }
    };

    // Override para console.error
    console.error = (...args) => {
      if (isLogging) {
        originalConsoleRef.current!.error(...args);
        return;
      }
      
      isLogging = true;
      originalConsoleRef.current!.error(...args);
      
      try {
        logFunctionsRef.current.error(
          args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
        );
      } finally {
        isLogging = false;
      }
    };

    // Override para console.warn
    console.warn = (...args) => {
      if (isLogging) {
        originalConsoleRef.current!.warn(...args);
        return;
      }
      
      isLogging = true;
      originalConsoleRef.current!.warn(...args);
      
      try {
        logFunctionsRef.current.warn(
          args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
        );
      } finally {
        isLogging = false;
      }
    };

    // Override para console.info
    console.info = (...args) => {
      if (isLogging) {
        originalConsoleRef.current!.info(...args);
        return;
      }
      
      isLogging = true;
      originalConsoleRef.current!.info(...args);
      
      try {
        logFunctionsRef.current.info(
          args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
        );
      } finally {
        isLogging = false;
      }
    };

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
  }, [captureConsole]); // Solo depende de captureConsole, no de las funciones de logging

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

  // Filtrar logs por tipo o fuente
  const filterLogs = useCallback((filterFn: (log: LogEntry) => boolean) => {
    return logs.filter(filterFn);
  }, [logs]);

  // Filtros comunes
  const getErrorLogs = useCallback(() => filterLogs(log => log.type === 'error'), [filterLogs]);
  const getWarningLogs = useCallback(() => filterLogs(log => log.type === 'warn'), [filterLogs]);
  const getInfoLogs = useCallback(() => filterLogs(log => log.type === 'info'), [filterLogs]);
  
  const getLogsBySource = useCallback((source: string) => 
    filterLogs(log => log.source === source), [filterLogs]);

  return {
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
  };
} 