// Token data model
export interface Token {
  address: string;
  symbol: string;
  name: string;
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  priceHistory: PricePoint[];
  priceChange24h?: number;
  image?: string;
}

// Price history point
export interface PricePoint {
  timestamp: number;
  price: number;
}

// Alert data model
export interface Alert {
  id: string;
  tokenId: string;
  alertType: 'price' | 'volume';
  threshold: number;
  comparison: '>' | '<' | '>=' | '<=';
  status: 'active' | 'triggered' | 'inactive';
  createdAt: Date;
  triggeredAt?: Date;
}

// Social data model
export interface SocialData {
  tokenId: string;
  timestamp: number;
  sentimentScore: number; // -1 to 1 scale
  postVolume: number;
  platform: 'twitter' | 'reddit' | 'all';
}

// On-chain activity model
export interface OnChainActivity {
  tokenId: string;
  timestamp: number;
  activeAddresses: number;
  transactionCount: number;
  newContracts: number;
  gasUsed?: number;
}

// API response types
export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

// Component props types
export interface TokenCardProps {
  token: Token;
  onSelect?: (token: Token) => void;
  variant?: 'compact' | 'detailed';
}

export interface MetricDisplayProps {
  label: string;
  value: string | number;
  change?: number;
  format?: 'currency' | 'percentage' | 'number';
  withTrendIcon?: boolean;
}

export interface GraphProps {
  data: PricePoint[];
  variant?: 'small' | 'large';
  color?: string;
}

// Alert types
export interface AlertConfig {
  tokenId: string;
  type: 'price' | 'volume';
  threshold: number;
  comparison: '>' | '<' | '>=' | '<=';
}

// Social sentiment types
export interface SentimentMeterProps {
  score: number;
  volume: number;
  variant?: 'gauge' | 'bar';
}

// On-chain stat types
export interface OnChainStatProps {
  label: string;
  value: number;
  change?: number;
  format?: 'number' | 'currency';
}

// API error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: ApiError;
}

// Search types
export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

