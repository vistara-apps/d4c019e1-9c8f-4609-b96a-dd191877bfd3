import { CoinGeckoToken, Token, PricePoint, SearchResult } from '../types';
import { apiRequest, transformCoinGeckoToken, getCachedData, setCachedData } from './api';

// CoinGecko API endpoints
const ENDPOINTS = {
  MARKETS: '/coins/markets',
  COIN: '/coins',
  SEARCH: '/search',
  TRENDING: '/search/trending',
} as const;

// Get market data for multiple tokens
export const getMarketData = async (
  vsCurrency: string = 'usd',
  ids?: string[],
  order: string = 'market_cap_desc',
  perPage: number = 100,
  page: number = 1,
  sparkline: boolean = false
): Promise<{ data: Token[] | null; error: any }> => {
  const cacheKey = `markets_${vsCurrency}_${ids?.join(',')}_${order}_${perPage}_${page}`;

  // Check cache first
  const cached = getCachedData<Token[]>(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const params: any = {
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page,
    sparkline,
    price_change_percentage: '24h',
  };

  if (ids && ids.length > 0) {
    params.ids = ids.join(',');
  }

  const { data, error } = await apiRequest<CoinGeckoToken[]>(
    ENDPOINTS.MARKETS,
    params
  );

  if (error) {
    return { data: null, error };
  }

  const tokens = data?.map(transformCoinGeckoToken) || [];

  // Cache the result
  setCachedData(cacheKey, tokens);

  return { data: tokens, error: null };
};

// Get detailed data for a specific token
export const getTokenData = async (
  id: string,
  includePriceHistory: boolean = true
): Promise<{ data: Token | null; error: any }> => {
  const cacheKey = `token_${id}_${includePriceHistory}`;

  const cached = getCachedData<Token>(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const params = {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: includePriceHistory,
  };

  const { data, error } = await apiRequest<any>(
    `${ENDPOINTS.COIN}/${id}`,
    params
  );

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: { message: 'Token not found' } };
  }

  const token: Token = {
    address: data.id,
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    priceUsd: data.market_data?.current_price?.usd || 0,
    marketCap: data.market_data?.market_cap?.usd || 0,
    volume24h: data.market_data?.total_volume?.usd || 0,
    circulatingSupply: data.market_data?.circulating_supply || 0,
    priceHistory: includePriceHistory && data.market_data?.sparkline_7d?.price
      ? data.market_data.sparkline_7d.price.map((price: number, index: number) => ({
          timestamp: Date.now() - (168 - index) * 3600000, // Approximate hourly timestamps
          price,
        }))
      : [],
    priceChange24h: data.market_data?.price_change_percentage_24h,
    image: data.image?.large,
  };

  setCachedData(cacheKey, token);

  return { data: token, error: null };
};

// Get price history for a token
export const getPriceHistory = async (
  id: string,
  days: number = 7,
  interval: string = 'hourly'
): Promise<{ data: PricePoint[] | null; error: any }> => {
  const cacheKey = `price_history_${id}_${days}_${interval}`;

  const cached = getCachedData<PricePoint[]>(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const params = {
    vs_currency: 'usd',
    days: days.toString(),
    interval,
  };

  const { data, error } = await apiRequest<any>(
    `${ENDPOINTS.COIN}/${id}/market_chart`,
    params
  );

  if (error) {
    return { data: null, error };
  }

  const priceHistory: PricePoint[] = data?.prices?.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  })) || [];

  setCachedData(cacheKey, priceHistory);

  return { data: priceHistory, error: null };
};

// Search for tokens
export const searchTokens = async (
  query: string
): Promise<{ data: SearchResult[] | null; error: any }> => {
  const cacheKey = `search_${query}`;

  const cached = getCachedData<SearchResult[]>(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const { data, error } = await apiRequest<any>(
    ENDPOINTS.SEARCH,
    { query }
  );

  if (error) {
    return { data: null, error };
  }

  const results: SearchResult[] = data?.coins?.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    thumb: coin.thumb,
  })) || [];

  setCachedData(cacheKey, results);

  return { data: results, error: null };
};

// Get trending tokens
export const getTrendingTokens = async (): Promise<{ data: Token[] | null; error: any }> => {
  const cacheKey = 'trending';

  const cached = getCachedData<Token[]>(cacheKey);
  if (cached) {
    return { data: cached, error: null };
  }

  const { data, error } = await apiRequest<any>(ENDPOINTS.TRENDING);

  if (error) {
    return { data: null, error };
  }

  const trendingIds = data?.coins?.map((coin: any) => coin.item.id) || [];

  if (trendingIds.length === 0) {
    return { data: [], error: null };
  }

  // Get detailed data for trending tokens
  const { data: tokens, error: tokenError } = await getMarketData('usd', trendingIds);

  if (tokenError) {
    return { data: null, error: tokenError };
  }

  setCachedData(cacheKey, tokens || []);

  return { data: tokens, error: null };
};

// Popular tokens to show by default
export const POPULAR_TOKENS = [
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
  'cardano',
  'polkadot',
  'dogecoin',
  'avalanche-2',
  'chainlink',
];
