/**
 * Datos de prueba para el desarrollo del Crypto Dashboard
 * Contiene la información requerida en Description.md:
 * - Nombre y símbolo de cada criptomoneda
 * - Tasa de cambio actual a USD
 * - Tasa de cambio actual a Bitcoin (BTC)
 */

import type { Cryptocurrency } from "~/models/cryptocurrency";

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
    currentPrice: 65432.10,
    marketCap: 1258000000000,
    marketCapRank: 1,
    totalVolume: 25000000000,
    priceChangePercentage24h: 2.5,
    circulatingSupply: 19000000,
    totalSupply: 21000000,
    maxSupply: 21000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    currentPrice: 3456.78,
    marketCap: 416000000000,
    marketCapRank: 2,
    totalVolume: 15000000000,
    priceChangePercentage24h: 1.2,
    circulatingSupply: 120000000,
    totalSupply: 120000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "Binance Coin",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    currentPrice: 567.89,
    marketCap: 87600000000,
    marketCapRank: 3,
    totalVolume: 1560000000,
    priceChangePercentage24h: 0.3,
    circulatingSupply: 154500000,
    totalSupply: 165116760,
    maxSupply: 165116760,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    currentPrice: 154.32,
    marketCap: 67000000000,
    marketCapRank: 4,
    totalVolume: 2800000000,
    priceChangePercentage24h: 3.7,
    circulatingSupply: 435000000,
    totalSupply: 557000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    currentPrice: 0.58,
    marketCap: 31500000000,
    marketCapRank: 5,
    totalVolume: 980000000,
    priceChangePercentage24h: 0.7,
    circulatingSupply: 54300000000,
    totalSupply: 100000000000,
    maxSupply: 100000000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    currentPrice: 0.543,
    marketCap: 19200000000,
    marketCapRank: 6,
    totalVolume: 410000000,
    priceChangePercentage24h: -0.8,
    circulatingSupply: 35400000000,
    totalSupply: 45000000000,
    maxSupply: 45000000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    currentPrice: 7.89,
    marketCap: 9800000000,
    marketCapRank: 7,
    totalVolume: 290000000,
    priceChangePercentage24h: -1.2,
    circulatingSupply: 1240000000,
    totalSupply: 1270000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "avalanche",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    currentPrice: 34.56,
    marketCap: 12400000000,
    marketCapRank: 8,
    totalVolume: 670000000,
    priceChangePercentage24h: 5.2,
    circulatingSupply: 359000000,
    totalSupply: 435000000,
    maxSupply: 720000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    currentPrice: 0.123,
    marketCap: 17500000000,
    marketCapRank: 9,
    totalVolume: 890000000,
    priceChangePercentage24h: -2.1,
    circulatingSupply: 142000000000,
    totalSupply: 142000000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "shiba-inu",
    symbol: "shib",
    name: "Shiba Inu",
    image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    currentPrice: 0.0000234,
    marketCap: 13800000000,
    marketCapRank: 10,
    totalVolume: 430000000,
    priceChangePercentage24h: 1.9,
    circulatingSupply: 589000000000000,
    totalSupply: 589000000000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    currentPrice: 0.121,
    marketCap: 10900000000,
    marketCapRank: 11,
    totalVolume: 380000000,
    priceChangePercentage24h: 1.4,
    circulatingSupply: 90000000000,
    totalSupply: 92000000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "litecoin",
    symbol: "ltc",
    name: "Litecoin",
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    currentPrice: 78.45,
    marketCap: 5800000000,
    marketCapRank: 12,
    totalVolume: 320000000,
    priceChangePercentage24h: -0.3,
    circulatingSupply: 73900000,
    totalSupply: 84000000,
    maxSupply: 84000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    currentPrice: 13.67,
    marketCap: 7900000000,
    marketCapRank: 13,
    totalVolume: 420000000,
    priceChangePercentage24h: 2.8,
    circulatingSupply: 578000000,
    totalSupply: 1000000000,
    maxSupply: 1000000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    currentPrice: 8.92,
    marketCap: 6700000000,
    marketCapRank: 14,
    totalVolume: 210000000,
    priceChangePercentage24h: -1.5,
    circulatingSupply: 753000000,
    totalSupply: 1000000000,
    maxSupply: 1000000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cosmos",
    symbol: "atom",
    name: "Cosmos",
    image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
    currentPrice: 7.23,
    marketCap: 2800000000,
    marketCapRank: 15,
    totalVolume: 130000000,
    priceChangePercentage24h: 1.1,
    circulatingSupply: 387000000,
    totalSupply: 387000000,
    maxSupply: null,
    lastUpdated: new Date().toISOString(),
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