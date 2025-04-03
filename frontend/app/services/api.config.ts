/**
 * Configuración base para la API
 * Este archivo centraliza la configuración de la API y manejo de errores
 */

// URL base para la API de Coinbase
export const API_BASE_URL = 'https://api.coinbase.com/v2';

// Rutas de API para diferentes endpoints
export const API_ROUTES = {
  exchangeRates: '/exchange-rates',
  currencies: '/currencies',
  prices: '/prices',
};

// Opciones por defecto para fetch
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
      errorData?.message || 'Error en la solicitud a la API',
      errorData
    );
  }
  
  return response.json() as Promise<T>;
} 