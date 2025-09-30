import axios, { AxiosResponse } from 'axios';
import { CoinGeckoToken, Token, PricePoint, ApiError } from '../types';

// Base API configuration
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Error handling
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.error || 'API request failed',
      code: error.response.data?.error_code,
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// Rate limiting helper
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
};

// Generic API request wrapper
export const apiRequest = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<{ data: T | null; error: ApiError | null }> => {
  try {
    await enforceRateLimit();

    const response: AxiosResponse<T> = await apiClient.get(url, { params });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleApiError(error),
    };
  }
};

// Convert CoinGecko response to our Token format
export const transformCoinGeckoToken = (cgToken: CoinGeckoToken): Token => {
  return {
    address: cgToken.id, // Using ID as address for now
    symbol: cgToken.symbol.toUpperCase(),
    name: cgToken.name,
    priceUsd: cgToken.current_price,
    marketCap: cgToken.market_cap,
    volume24h: cgToken.total_volume,
    circulatingSupply: cgToken.circulating_supply,
    priceHistory: [], // Will be populated separately
    priceChange24h: cgToken.price_change_percentage_24h,
    image: cgToken.image,
  };
};

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

