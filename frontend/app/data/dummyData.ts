/**
 * Datos de prueba para el desarrollo del Crypto Dashboard
 * Contiene la información requerida en Description.md:
 * - Nombre y símbolo de cada criptomoneda
 * - Tasa de cambio actual a USD
 * - Tasa de cambio actual a Bitcoin (BTC)
 */

import type { Cryptocurrency } from "~/types/crypto";

/**
 * Colección de criptomonedas para el desarrollo
 * Incluye las 15 principales para asegurar tener más de las 10 requeridas
 */
export const dummyCryptocurrencies: Cryptocurrency[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
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
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
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
    id: "binancecoin",
    symbol: "bnb",
    name: "Binance Coin",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
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
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
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
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
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
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
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
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
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
    id: "avalanche",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
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
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
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
    id: "shiba-inu",
    symbol: "shib",
    name: "Shiba Inu",
    image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    current_price: {
      usd: 0.0000234,
      btc: 3.61e-10,
    },
    price_change_percentage_24h: 1.9,
    market_cap: 13800000000,
    total_volume: 430000000,
    circulating_supply: 589000000000000,
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    current_price: {
      usd: 0.121,
      btc: 0.00000186,
    },
    price_change_percentage_24h: 1.4,
    market_cap: 10900000000,
    total_volume: 380000000,
    circulating_supply: 90000000000,
  },
  {
    id: "litecoin",
    symbol: "ltc",
    name: "Litecoin",
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    current_price: {
      usd: 78.45,
      btc: 0.00121,
    },
    price_change_percentage_24h: -0.3,
    market_cap: 5800000000,
    total_volume: 320000000,
    circulating_supply: 73900000,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: {
      usd: 13.67,
      btc: 0.000211,
    },
    price_change_percentage_24h: 2.8,
    market_cap: 7900000000,
    total_volume: 420000000,
    circulating_supply: 578000000,
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: {
      usd: 8.92,
      btc: 0.000138,
    },
    price_change_percentage_24h: -1.5,
    market_cap: 6700000000,
    total_volume: 210000000,
    circulating_supply: 753000000,
  },
  {
    id: "cosmos",
    symbol: "atom",
    name: "Cosmos",
    image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
    current_price: {
      usd: 7.23,
      btc: 0.000111,
    },
    price_change_percentage_24h: 1.1,
    market_cap: 2800000000,
    total_volume: 130000000,
    circulating_supply: 387000000,
  }
];

/**
 * Retorna una lista de criptomonedas con datos de prueba
 * @param limit Número de criptomonedas a retornar (por defecto todas)
 */
export function getDummyCryptocurrencies(limit?: number): Cryptocurrency[] {
  if (limit && limit > 0 && limit < dummyCryptocurrencies.length) {
    return dummyCryptocurrencies.slice(0, limit);
  }
  return dummyCryptocurrencies;
}

/**
 * Retorna una criptomoneda específica por su ID
 * @param id ID de la criptomoneda a buscar
 */
export function getDummyCryptocurrencyById(id: string): Cryptocurrency | undefined {
  return dummyCryptocurrencies.find(crypto => crypto.id === id);
}

/**
 * Filtra criptomonedas por nombre o símbolo
 * @param query Texto para filtrar (nombre o símbolo)
 */
export function filterDummyCryptocurrencies(query: string): Cryptocurrency[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return dummyCryptocurrencies;
  }
  
  return dummyCryptocurrencies.filter(crypto => 
    crypto.name.toLowerCase().includes(normalizedQuery) || 
    crypto.symbol.toLowerCase().includes(normalizedQuery)
  );
} 