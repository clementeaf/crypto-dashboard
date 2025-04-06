/**
 * Configuración base para la API
 * Este archivo centraliza la configuración de la API y manejo de errores
 */

// URL base para la API pública de Coinbase 
export const API_BASE_URL = 'https://api.coinbase.com/v2';

// Rutas de API para diferentes endpoints
export const API_ROUTES = {
  exchangeRates: '/exchange-rates',
  currencies: '/currencies',
  prices: '/prices/spot',
  ticker: '/prices',
};

// Opciones por defecto para fetch
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'CB-VERSION': '2023-06-15' // Versión de la API de Coinbase
  },
  // Timeout de 15 segundos
  signal: AbortSignal.timeout(15000),
};

// Función para construir URLs completas de API
export function buildApiUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
}

/**
 * Función para probar la conexión con la API de Coinbase
 * Esta función intenta hacer una solicitud simple a la API pública
 * y devuelve un resultado indicando si la conexión es exitosa
 */
export async function testApiConnection(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  responseTime?: number;
}> {
  const startTime = Date.now();
  
  try {
    // Intentamos obtener el precio de BTC, un endpoint simple y rápido
    const url = buildApiUrl(`${API_ROUTES.ticker}/BTC-USD/spot`);
    
    console.log(`[TEST] Probando conexión a API: ${url}`);
    
    const response = await fetch(url, { 
      ...defaultFetchOptions, 
      method: 'GET',
      // Reducimos el timeout para la prueba
      signal: AbortSignal.timeout(5000)
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`[TEST] Tiempo de respuesta: ${responseTime}ms`);
    
    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        error: `Error ${response.status}: ${response.statusText}`,
        responseTime
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data,
      statusCode: response.status,
      responseTime
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[TEST] Error al probar conexión:', error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Timeout: La solicitud tardó demasiado en completarse',
        responseTime
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      responseTime
    };
  }
}

// Clase para manejar errores de API de forma consistente
export class ApiResponseError extends Error {
  status: number;
  statusText: string;
  data?: any;

  constructor(status: number, statusText: string, message: string, data?: any) {
    super(message);
    this.name = 'ApiResponseError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Función para manejar respuestas y errores de forma consistente
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = null;
    }
    
    throw new ApiResponseError(
      response.status,
      response.statusText,
      errorData?.errors?.[0]?.message || 'Error en la solicitud a la API',
      errorData
    );
  }
  
  return response.json() as Promise<T>;
} 