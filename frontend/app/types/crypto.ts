/**
 * Tipos de datos para la información de criptomonedas
 */

// Tipo para una criptomoneda individual
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: {
    usd: number;
    btc: number;
  };
  price_change_percentage_24h?: number;
  market_cap?: number;
  total_volume?: number;
  circulating_supply?: number;
}

// Tipo para la respuesta de la API con múltiples criptomonedas
export interface CryptocurrenciesResponse {
  data: Cryptocurrency[];
  timestamp: number;
}

// Tipo para los errores de la API
export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

// Tipo para las tasas de cambio
export interface ExchangeRates {
  base: string;
  rates: {
    [currency: string]: number;
  };
}

// Tipo para el estado de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Tipo para el orden de las tarjetas guardado en localStorage
export interface SavedCardOrder {
  ids: string[];
  timestamp: number;
} 