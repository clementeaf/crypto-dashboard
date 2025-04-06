import { useState, useEffect, useCallback } from 'react';

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

  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Añadir una entrada de log
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'log', source?: string) => {
    const entry: LogEntry = {
      message: typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message),
      type,
      timestamp: new Date().toISOString(),
      source
    };

    setLogs(prev => {
      const newLogs = [entry, ...prev].slice(0, maxLogs);
      
      // Persistir logs si está habilitado
      if (persistLogs) {
        try {
          localStorage.setItem('app_logs', JSON.stringify(newLogs));
        } catch (error) {
          // Silenciar errores de localStorage
        }
      }
      
      return newLogs;
    });
    
    return entry;
  }, [maxLogs, persistLogs]);

  // Métodos para diferentes tipos de logs
  const log = useCallback((message: any, source?: string) => addLog(message, 'log', source), [addLog]);
  const error = useCallback((message: any, source?: string) => addLog(message, 'error', source), [addLog]);
  const warn = useCallback((message: any, source?: string) => addLog(message, 'warn', source), [addLog]);
  const info = useCallback((message: any, source?: string) => addLog(message, 'info', source), [addLog]);

  // Limpiar todos los logs
  const clearLogs = useCallback(() => {
    setLogs([]);
    if (persistLogs) {
      try {
        localStorage.removeItem('app_logs');
      } catch (error) {
        // Silenciar errores de localStorage
      }
    }
  }, [persistLogs]);

  // Capturar console.log, console.error, etc.
  useEffect(() => {
    if (!captureConsole) return;

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      log(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      error(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      warn(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
    };

    console.info = (...args) => {
      originalConsole.info(...args);
      info(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
    };

    // Restaurar los métodos originales cuando se desmonte el componente
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, [captureConsole, log, error, warn, info]);

  // Cargar logs persistentes si está habilitado
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