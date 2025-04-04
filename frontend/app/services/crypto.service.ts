/**
 * Servicio para interactuar con la API de criptomonedas
 */
import { 
  API_ROUTES, 
  defaultFetchOptions, 
  buildApiUrl, 
  handleApiResponse,
} from './api.config';
import { 
  getDummyCryptocurrencies,
  getDummyCryptocurrencyById,
  filterDummyCryptocurrencies
} from '~/data/dummyData';
import type { Cryptocurrency } from '~/types/crypto';

/**
 * Interfaz para tasas de cambio
 */
export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

/**
 * Obtiene las tasas de cambio para una moneda base específica
 */
export async function getExchangeRates(currency: string = 'USD'): Promise<ExchangeRates> {
  // En un entorno real, haríamos una llamada a la API:
  // const url = buildApiUrl(API_ROUTES.exchangeRates, { currency });
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<{ data: ExchangeRates }>(response);
  // return data.data;
  
  // Mientras tanto, simulamos una respuesta con datos de prueba
  // Simulamos un delay para simular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    base: currency,
    rates: {
      USD: 1,
      BTC: 0.000015,
      ETH: 0.00029,
      SOL: 0.0065,
      ADA: 1.84,
      DOT: 0.127,
      XRP: 1.72,
      DOGE: 8.13,
      AVAX: 0.029,
      LINK: 0.073,
      UNI: 0.112,
      LTC: 0.0128,
      ATOM: 0.138,
      SHIB: 42735.04,
      TRX: 8.26,
      BNB: 0.00176,
    }
  };
}

/**
 * Convierte el formato de criptomoneda de nuestro modelo interno
 * al formato esperado por el Dashboard existente
 */
function adaptCryptoFormat(crypto: any): Cryptocurrency {
  return {
    id: crypto.id,
    symbol: crypto.symbol,
    name: crypto.name,
    image: crypto.image,
    current_price: {
      usd: crypto.currentPrice,
      btc: crypto.currentPrice * 0.000015 // Aproximación
    },
    price_change_percentage_24h: crypto.priceChangePercentage24h,
    market_cap: crypto.marketCap,
    total_volume: crypto.totalVolume,
    circulating_supply: crypto.circulatingSupply
  };
}

/**
 * Obtiene una lista de criptomonedas con sus detalles
 */
export async function getCryptocurrencies(limit?: number): Promise<Cryptocurrency[]> {
  // En un entorno real, haríamos una llamada a la API:
  // const url = buildApiUrl(API_ROUTES.prices, { order: 'market_cap_desc', limit: limit?.toString() });
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<{ data: Cryptocurrency[] }>(response);
  // return data.data;
  
  // Simulamos un delay para simular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Utilizamos los datos dummy y los adaptamos al formato esperado
  const cryptos = getDummyCryptocurrencies(limit);
  return cryptos.map(adaptCryptoFormat);
}

/**
 * Obtiene los datos detallados de una criptomoneda específica
 */
export async function getCryptocurrencyById(id: string): Promise<Cryptocurrency> {
  // En un entorno real, haríamos una llamada a la API:
  // const url = buildApiUrl(`${API_ROUTES.prices}/${id}`);
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<{ data: Cryptocurrency }>(response);
  // return data.data;
  
  // Simulamos un delay para simular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Utilizamos los datos dummy
  const crypto = getDummyCryptocurrencyById(id);
  
  if (!crypto) {
    throw new Error(`Criptomoneda con ID ${id} no encontrada`);
  }
  
  return adaptCryptoFormat(crypto);
}

/**
 * Filtra criptomonedas por nombre o símbolo
 */
export async function searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
  // En un entorno real, haríamos una llamada a la API:
  // const url = buildApiUrl(API_ROUTES.search, { query });
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<{ data: Cryptocurrency[] }>(response);
  // return data.data;
  
  // Simulamos un delay para simular la latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Utilizamos los datos dummy
  const cryptos = filterDummyCryptocurrencies(query);
  return cryptos.map(adaptCryptoFormat);
} 