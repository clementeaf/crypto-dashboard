/**
 * Utilidades para la persistencia local de datos
 */
import type { SavedCardOrder } from '~/types/crypto';

// Prefijo para todas las claves de almacenamiento
const STORAGE_PREFIX = 'crypto_dashboard_';

// Claves específicas para diferentes tipos de datos
const STORAGE_KEYS = {
  CARD_ORDER: `${STORAGE_PREFIX}card_order`,
  THEME: `${STORAGE_PREFIX}theme`,
  LAST_REFRESH: `${STORAGE_PREFIX}last_refresh`,
};

// Clave para almacenar la preferencia de tema
const THEME_KEY = 'crypto-dashboard-theme';

type Theme = 'light' | 'dark' | 'system';

/**
 * Guarda el orden de las tarjetas en localStorage
 */
export function saveCardOrder(cardIds: string[]): void {
  if (!isLocalStorageAvailable()) return;
  
  const data: SavedCardOrder = {
    ids: cardIds,
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(STORAGE_KEYS.CARD_ORDER, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar el orden de tarjetas:', error);
  }
}

/**
 * Recupera el orden guardado de tarjetas desde localStorage
 */
export function getCardOrder(): string[] | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.CARD_ORDER);
    if (!savedData) return null;
    
    const data = JSON.parse(savedData) as SavedCardOrder;
    
    // Verifica si los datos son demasiado antiguos (más de 1 día)
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > oneDayMs) {
      localStorage.removeItem(STORAGE_KEYS.CARD_ORDER);
      return null;
    }
    
    return data.ids;
  } catch (error) {
    console.error('Error al recuperar el orden de tarjetas:', error);
    return null;
  }
}

/**
 * Registra la última vez que se actualizaron los datos
 */
export function setLastRefreshTime(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
  } catch (error) {
    console.error('Error al guardar el tiempo de actualización:', error);
  }
}

/**
 * Obtiene el tiempo transcurrido desde la última actualización
 * @returns Tiempo transcurrido en segundos, o null si no hay dato
 */
export function getTimeSinceLastRefresh(): number | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const lastRefresh = localStorage.getItem(STORAGE_KEYS.LAST_REFRESH);
    if (!lastRefresh) return null;
    
    const lastRefreshTime = parseInt(lastRefresh, 10);
    return Math.floor((Date.now() - lastRefreshTime) / 1000);
  } catch (error) {
    console.error('Error al obtener el tiempo desde la última actualización:', error);
    return null;
  }
}

/**
 * Guarda la preferencia de tema en localStorage
 */
export function saveThemePreference(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error al guardar preferencia de tema:', error);
  }
}

/**
 * Recupera la preferencia de tema desde localStorage
 * Si no existe, devuelve 'system'
 */
export function getThemePreference(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const theme = localStorage.getItem(THEME_KEY) as Theme;
    return theme || 'system';
  } catch (error) {
    console.error('Error al recuperar preferencia de tema:', error);
    return 'system';
  }
}

/**
 * Función para detectar si el sistema está configurado en modo oscuro
 */
export function isSystemDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Verifica si localStorage está disponible
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = `${STORAGE_PREFIX}test`;
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
} 