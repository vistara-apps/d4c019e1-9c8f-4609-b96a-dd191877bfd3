export interface Token {
  id: string
  address: string
  symbol: string
  name: string
  priceUsd: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  priceHistory: PricePoint[]
}

export interface PricePoint {
  timestamp: number
  price: number
}

export interface Alert {
  id: string
  tokenId: string
  alertType: 'price' | 'volume'
  threshold: number
  comparison: '>' | '<'
  status: 'active' | 'triggered'
  createdAt: number
}

export interface SocialData {
  tokenId: string
  timestamp: number
  sentimentScore: number // 0-1 scale
  postVolume: number
}

export interface OnChainActivity {
  tokenId: string
  timestamp: number
  activeAddresses: number
  transactionCount: number
  newContracts: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

