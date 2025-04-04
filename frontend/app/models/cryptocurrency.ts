/**
 * Modelo que representa una criptomoneda con sus datos relevantes
 */
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  priceChangePercentage24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  lastUpdated: string;
} 