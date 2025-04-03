/**
 * Servicio para interactuar con la API de criptomonedas
 */
import { 
  API_ROUTES, 
  defaultFetchOptions, 
  buildApiUrl, 
  handleApiResponse,
} from './api.config';
import type { 
  Cryptocurrency, 
  CryptocurrenciesResponse,
  ExchangeRates,
} from '~/types/crypto';

/**
 * Obtiene las tasas de cambio para una moneda base específica
 */
export async function getExchangeRates(currency: string = 'USD'): Promise<ExchangeRates> {
  const url = buildApiUrl(API_ROUTES.exchangeRates, { currency });
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });
  
  const data = await handleApiResponse<{ data: ExchangeRates }>(response);
  return data.data;
}

/**
 * Obtiene una lista de criptomonedas con sus detalles
 * 
 * NOTA: Esta función usa datos de prueba temporales hasta que tengamos acceso
 * a la API real. Más adelante, será reemplazada por llamadas reales.
 */
export async function getCryptocurrencies(): Promise<Cryptocurrency[]> {
  // En un entorno real, haríamos una llamada a la API aquí:
  // const url = buildApiUrl(API_ROUTES.prices, { order: 'market_cap_desc' });
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<CryptocurrenciesResponse>(response);
  // return data.data;
  
  // Mientras tanto, devolvemos datos de prueba
  return getMockCryptocurrencies();
}

/**
 * Obtiene los datos detallados de una criptomoneda específica
 */
export async function getCryptocurrencyById(id: string): Promise<Cryptocurrency> {
  // En un entorno real, haríamos una llamada a la API aquí:
  // const url = buildApiUrl(`${API_ROUTES.prices}/${id}`);
  // const response = await fetch(url, { ...defaultFetchOptions, method: 'GET' });
  // const data = await handleApiResponse<{ data: Cryptocurrency }>(response);
  // return data.data;
  
  // Mientras tanto, devolvemos datos de prueba
  const allCryptos = await getMockCryptocurrencies();
  const crypto = allCryptos.find(c => c.id === id);
  
  if (!crypto) {
    throw new Error(`Criptomoneda con ID ${id} no encontrada`);
  }
  
  return crypto;
}

/**
 * Datos de prueba para criptomonedas
 * Esta función será eliminada cuando tengamos la API real
 */
function getMockCryptocurrencies(): Cryptocurrency[] {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: {
        usd: 65432.10,
        btc: 1,
      },
      price_change_percentage_24h: 2.5,
      market_cap: 1258000000000,
      total_volume: 25000000000,
      circulating_supply: 19000000,
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: {
        usd: 3456.78,
        btc: 0.05321,
      },
      price_change_percentage_24h: 1.2,
      market_cap: 416000000000,
      total_volume: 15000000000,
      circulating_supply: 120000000,
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      current_price: {
        usd: 154.32,
        btc: 0.00238,
      },
      price_change_percentage_24h: 3.7,
      market_cap: 67000000000,
      total_volume: 2800000000,
      circulating_supply: 435000000,
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      current_price: {
        usd: 0.543,
        btc: 0.0000083,
      },
      price_change_percentage_24h: -0.8,
      market_cap: 19200000000,
      total_volume: 410000000,
      circulating_supply: 35400000000,
    },
    {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      current_price: {
        usd: 7.89,
        btc: 0.000122,
      },
      price_change_percentage_24h: -1.2,
      market_cap: 9800000000,
      total_volume: 290000000,
      circulating_supply: 1240000000,
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      current_price: {
        usd: 0.58,
        btc: 0.0000089,
      },
      price_change_percentage_24h: 0.7,
      market_cap: 31500000000,
      total_volume: 980000000,
      circulating_supply: 54300000000,
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'Binance Coin',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      current_price: {
        usd: 567.89,
        btc: 0.00876,
      },
      price_change_percentage_24h: 0.3,
      market_cap: 87600000000,
      total_volume: 1560000000,
      circulating_supply: 154500000,
    },
    {
      id: 'avalanche',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      current_price: {
        usd: 34.56,
        btc: 0.000533,
      },
      price_change_percentage_24h: 5.2,
      market_cap: 12400000000,
      total_volume: 670000000,
      circulating_supply: 359000000,
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      current_price: {
        usd: 0.123,
        btc: 0.00000189,
      },
      price_change_percentage_24h: -2.1,
      market_cap: 17500000000,
      total_volume: 890000000,
      circulating_supply: 142000000000,
    },
    {
      id: 'shiba-inu',
      symbol: 'shib',
      name: 'Shiba Inu',
      image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
      current_price: {
        usd: 0.0000234,
        btc: 3.61e-10,
      },
      price_change_percentage_24h: 1.9,
      market_cap: 13800000000,
      total_volume: 430000000,
      circulating_supply: 589000000000000,
    },
  ];
} 