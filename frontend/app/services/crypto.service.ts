/**
 * Servicio para interactuar con la API de criptomonedas de Coinbase
 */
import { 
  API_ROUTES, 
  defaultFetchOptions, 
  buildApiUrl, 
  handleApiResponse,
  ApiResponseError,
} from './api.config';
import type { Cryptocurrency } from '~/types/crypto';

// Conjunto predefinido de IDs de criptomonedas populares para solicitar
const TOP_CRYPTO_IDS = [
  'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 
  'MATIC', 'LTC', 'LINK', 'UNI', 'ATOM', 'SHIB'
];

// Reducimos la cantidad de criptomonedas solicitadas para evitar timeouts
const DEFAULT_LIMIT = 10; // Aumentamos a 10 para cumplir con los requisitos

// Sistema de caché para reducir solicitudes a la API
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE: {
  [key: string]: CacheItem<any>;
} = {};

// Tiempo de caducidad de la caché (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;

// Retraso entre solicitudes para evitar rate limiting
const API_DELAY = 300; // milisegundos

// Configuración para reintentos de solicitudes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo entre reintentos

// Función para esperar un tiempo determinado
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Información complementaria para las criptomonedas
const CRYPTO_INFO: { [key: string]: { name: string; id: string } } = {
  'BTC': { name: 'Bitcoin', id: 'bitcoin' },
  'ETH': { name: 'Ethereum', id: 'ethereum' },
  'SOL': { name: 'Solana', id: 'solana' },
  'BNB': { name: 'Binance Coin', id: 'binancecoin' },
  'XRP': { name: 'XRP', id: 'ripple' },
  'ADA': { name: 'Cardano', id: 'cardano' },
  'DOGE': { name: 'Dogecoin', id: 'dogecoin' },
  'AVAX': { name: 'Avalanche', id: 'avalanche-2' },
  'DOT': { name: 'Polkadot', id: 'polkadot' },
  'MATIC': { name: 'Polygon', id: 'matic-network' },
  'LTC': { name: 'Litecoin', id: 'litecoin' },
  'LINK': { name: 'Chainlink', id: 'chainlink' },
  'UNI': { name: 'Uniswap', id: 'uniswap' },
  'ATOM': { name: 'Cosmos', id: 'cosmos' },
  'SHIB': { name: 'Shiba Inu', id: 'shiba-inu' }
};

// Usamos URLs del servicio cryptoicons.org que permite CORS
// en lugar de referenciar directamente desde Coinbase
function getCryptoIconUrl(symbol: string): string {
  return `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/200`;
}

/**
 * Interfaz para tasas de cambio
 */
export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

/**
 * Función genérica para obtener datos de la API con caché
 */
async function fetchWithCache<T>(
  cacheKey: string, 
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  // Comprobar si hay datos en caché y no han caducado
  const cachedItem = CACHE[cacheKey];
  const now = Date.now();
  
  if (cachedItem && (now - cachedItem.timestamp) < ttl) {
    console.log(`[CACHE] Usando datos en caché para ${cacheKey}`);
    return cachedItem.data;
  }
  
  // Si no hay datos en caché o han caducado, obtener nuevos datos
  console.log(`[API] Solicitando nuevos datos para ${cacheKey}`);
  const data = await fetchFn();
  
  // Guardar en caché
  CACHE[cacheKey] = {
    data,
    timestamp: now
  };
  
  return data;
}

/**
 * Obtiene las tasas de cambio para una moneda base específica
 */
export async function getExchangeRates(currency: string = 'USD'): Promise<ExchangeRates> {
  const cacheKey = `exchange-rates-${currency}`;
  
  try {
    return await fetchWithCache(cacheKey, async () => {
      const url = buildApiUrl(API_ROUTES.exchangeRates, { currency });
      const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
      
      const data = await handleApiResponse<any>(response);
      
      // La API de Coinbase devuelve las tasas en formato: { data: { currency: "USD", rates: {...} } }
      return {
        base: data.data.currency,
        rates: data.data.rates
      };
    });
  } catch (error) {
    console.error('[ERROR] Error al obtener tasas de cambio:', error);
    
    // Devolvemos datos de respaldo en caso de error
    return {
      base: currency,
      rates: {
        USD: 1,
        BTC: 0.000015,
        ETH: 0.00029,
        // Otras tasas de respaldo
      }
    };
  }
}

/**
 * Obtiene una lista de criptomonedas con sus detalles desde Coinbase
 * @param limit Número de criptomonedas a obtener (por defecto 10)
 */
export async function getCryptocurrencies(limit: number = DEFAULT_LIMIT): Promise<Cryptocurrency[]> {
  try {
    // Limitamos a la cantidad solicitada
    const cryptoIDs = TOP_CRYPTO_IDS.slice(0, Math.min(limit, TOP_CRYPTO_IDS.length));
    
    console.log(`[DEBUG] Intentando obtener ${cryptoIDs.length} criptomonedas: ${cryptoIDs.join(', ')}`);
    
    // Primero intentamos obtener BTC para calcular las tasas
    const btcCacheKey = 'crypto-BTC';
    let btcPrice: number;
    
    try {
      // Intentamos obtener el precio de BTC primero
      const btcData = await fetchWithCache(btcCacheKey, () => getPriceData('BTC'));
      btcPrice = btcData.current_price.usd;
      console.log(`[DEBUG] Precio de BTC en USD obtenido primero: ${btcPrice}`);
    } catch (error) {
      console.error('[ERROR] Error al obtener precio de BTC, usando valor predeterminado:', error);
      btcPrice = 65000; // Valor predeterminado si falla
    }
    
    // Hacemos las solicitudes secuencialmente con retraso entre ellas
    const promises: Promise<Cryptocurrency>[] = [];
    
    for (const id of cryptoIDs) {
      // No necesitamos obtener BTC de nuevo
      if (id === 'BTC') {
        continue;
      }
      
      // Agregamos un retraso entre cada solicitud para evitar rate limiting
      if (promises.length > 0) {
        await sleep(API_DELAY);
      }
      
      const cacheKey = `crypto-${id}`;
      const promise = fetchWithCache(cacheKey, () => getPriceData(id));
      promises.push(promise);
    }
    
    // Esperamos a que todas las promesas se resuelvan
    const results = await Promise.allSettled(promises);
    
    // Log de los resultados
    console.log(`[DEBUG] Resultados obtenidos: ${results.filter(r => r.status === 'fulfilled').length} éxitos, ${results.filter(r => r.status === 'rejected').length} fallos`);
    
    // Filtramos solo las solicitudes exitosas
    const otherPrices = results
      .filter((result): result is PromiseFulfilledResult<Cryptocurrency> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
    
    // Creamos el objeto de Bitcoin con tasa en BTC = 1
    const bitcoin: Cryptocurrency = {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      image: getCryptoIconUrl('BTC'),
      current_price: {
        usd: btcPrice,
        btc: 1
      },
      price_change_percentage_24h: 0,
      market_cap: 0,
      total_volume: 0,
      circulating_supply: 0
    };
    
    // Agregamos la tasa en BTC a cada criptomoneda
    const allPrices = [
      bitcoin,
      ...otherPrices.map(crypto => ({
        ...crypto,
        current_price: {
          ...crypto.current_price,
          btc: crypto.current_price.usd / btcPrice
        }
      }))
    ];
    
    if (allPrices.length === 0) {
      throw new Error('No se pudieron obtener datos de ninguna criptomoneda');
    }
    
    console.log(`[DEBUG] Total de criptomonedas procesadas: ${allPrices.length}`);
    return allPrices;
  } catch (error) {
    console.error('[ERROR] Error al obtener criptomonedas:', error);
    
    if (error instanceof ApiResponseError) {
      throw new Error(`Error ${error.status}: ${error.message}`);
    }
    
    throw new Error('Error al cargar los datos de criptomonedas');
  }
}

/**
 * Obtiene el precio de una criptomoneda específica desde Coinbase
 * Incluye lógica de reintentos automáticos
 */
async function getPriceData(symbol: string): Promise<Cryptocurrency> {
  let lastError: any = null;
  
  // Intentar la solicitud varias veces
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const endpoint = `${API_ROUTES.ticker}/${symbol}-USD/spot`;
      const url = buildApiUrl(endpoint);
      console.log(`[DEBUG] Obteniendo precio para ${symbol} desde: ${url} (intento ${attempt}/${MAX_RETRIES})`);
      
      // Crear una señal de abort con timeout específico para esta solicitud
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segundos de timeout
      
      try {
        const response = await fetch(url, { 
          ...defaultFetchOptions, 
          method: 'GET',
          signal: controller.signal
        });
        
        // Limpiar el timeout
        clearTimeout(timeoutId);
        
        const data = await handleApiResponse<any>(response);
        
        // Si llegamos aquí, la solicitud fue exitosa
        console.log(`[DEBUG] Datos obtenidos correctamente para ${symbol}`);
        
        // La API de Coinbase devuelve los datos en formato: { data: { base: "BTC", currency: "USD", amount: "65000.00" } }
        const price = parseFloat(data.data.amount);
        
        // Construir objeto de criptomoneda con la información necesaria
        return {
          id: CRYPTO_INFO[symbol]?.id || symbol.toLowerCase(),
          symbol: symbol,
          name: CRYPTO_INFO[symbol]?.name || symbol,
          image: getCryptoIconUrl(symbol),
          current_price: {
            usd: price,
            btc: 0, // Se calculará después en getCryptocurrencies
          },
          price_change_percentage_24h: 0, // No disponible en este endpoint
          market_cap: 0, // No disponible en este endpoint
          total_volume: 0, // No disponible en este endpoint
          circulating_supply: 0 // No disponible en este endpoint
        };
      } finally {
        // Asegurarse de limpiar el timeout en caso de error
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error;
      console.error(`[ERROR] Error al obtener precio para ${symbol} (intento ${attempt}/${MAX_RETRIES}):`, error);
      
      // Si no es el último intento, esperar antes de reintentar
      if (attempt < MAX_RETRIES) {
        console.log(`[RETRY] Esperando ${RETRY_DELAY}ms antes de reintentar...`);
        await sleep(RETRY_DELAY);
      }
    }
  }
  
  // Si llegamos aquí, todos los intentos fallaron
  console.error(`[ERROR] Fallaron todos los intentos para obtener ${symbol}`);
  throw lastError;
}

/**
 * Obtiene los datos detallados de una criptomoneda específica
 * Nota: La API pública de Coinbase es limitada, por lo que añadimos datos de respaldo
 */
export async function getCryptocurrencyById(id: string): Promise<Cryptocurrency> {
  // Convertimos el ID al símbolo si es necesario
  const symbol = Object.entries(CRYPTO_INFO).find(([_, info]) => info.id === id)?.[0];
  
  if (!symbol) {
    throw new Error(`Criptomoneda con ID ${id} no encontrada`);
  }
  
  try {
    const cacheKey = `crypto-${symbol}`;
    return await fetchWithCache(cacheKey, () => getPriceData(symbol));
  } catch (error) {
    console.error(`[ERROR] Error al obtener la criptomoneda ${id}:`, error);
    
    if (error instanceof ApiResponseError) {
      if (error.status === 404) {
        throw new Error(`Criptomoneda con ID ${id} no encontrada`);
      }
      
      throw new Error(`Error ${error.status}: ${error.message}`);
    }
    
    throw new Error(`Error al cargar los datos de la criptomoneda ${id}`);
  }
}

/**
 * Obtiene la tasa de cambio de Bitcoin a USD
 */
export async function getBitcoinPriceInUSD(): Promise<number> {
  try {
    const cacheKey = 'btc-usd-price';
    return await fetchWithCache(cacheKey, async () => {
      const url = buildApiUrl(`${API_ROUTES.ticker}/BTC-USD/spot`);
      const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
      
      const data = await handleApiResponse<any>(response);
      
      return parseFloat(data.data.amount);
    });
  } catch (error) {
    console.error('[ERROR] Error al obtener el precio de Bitcoin:', error);
    // Valor de fallback si hay error
    return 65000;
  }
}

/**
 * Filtra criptomonedas por nombre o símbolo
 */
export async function searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
  try {
    // Obtenemos todas las criptomonedas y filtramos por nombre o símbolo
    const cryptos = await getCryptocurrencies();
    
    if (!query.trim()) {
      return cryptos;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    return cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(normalizedQuery) || 
      crypto.symbol.toLowerCase().includes(normalizedQuery)
    );
  } catch (error) {
    console.error('[ERROR] Error al buscar criptomonedas:', error);
    throw new Error('Error al buscar criptomonedas');
  }
}

/**
 * Limpia la caché de criptomonedas
 */
export function clearCache(): void {
  Object.keys(CACHE).forEach(key => {
    delete CACHE[key];
  });
  console.log('[CACHE] Caché limpiada');
} 