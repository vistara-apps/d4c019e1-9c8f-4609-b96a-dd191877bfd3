import { create } from 'zustand'
import { Token, Alert, SocialData, OnChainActivity } from '../types'

interface TokenStore {
  tokens: Token[]
  selectedToken: Token | null
  alerts: Alert[]
  socialData: SocialData[]
  onChainData: OnChainActivity[]
  loading: boolean
  error: string | null

  // Actions
  fetchTokens: () => Promise<void>
  setSelectedToken: (token: Token | null) => void
  addAlert: (alert: Alert) => void
  removeAlert: (alertId: string) => void
  fetchSocialData: (tokenId: string) => Promise<void>
  fetchOnChainData: (tokenId: string) => Promise<void>
  fetchTokenMetrics: (tokenId: string) => Promise<void>
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: [],
  selectedToken: null,
  alerts: [],
  socialData: [],
  onChainData: [],
  loading: false,
  error: null,

  fetchTokens: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/tokens')
      const result = await response.json()

      if (result.success) {
        set({ tokens: result.data, loading: false })
      } else {
        throw new Error(result.error || 'Failed to fetch tokens')
      }
    } catch (error) {
      console.error('Error fetching tokens:', error)
      set({ error: 'Failed to fetch tokens', loading: false })
    }
  },

  setSelectedToken: (token) => {
    set({ selectedToken: token })
  },

  addAlert: (alert) => {
    set((state) => ({ alerts: [...state.alerts, alert] }))
  },

  removeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    }))
  },

  fetchSocialData: async (tokenId) => {
    try {
      // Mock social data - in production, integrate with Twitter/X API
      const mockData: SocialData = {
        tokenId,
        timestamp: Date.now(),
        sentimentScore: Math.random() * 0.4 + 0.3, // Random between 0.3-0.7
        postVolume: Math.floor(Math.random() * 2000) + 500, // Random between 500-2500
      }
      set((state) => ({
        socialData: [...state.socialData.filter(d => d.tokenId !== tokenId), mockData]
      }))
    } catch (error) {
      console.error('Failed to fetch social data:', error)
    }
  },

  fetchOnChainData: async (tokenId) => {
    try {
      // Mock on-chain data - in production, integrate with Alchemy/Chainlink
      const mockData: OnChainActivity = {
        tokenId,
        timestamp: Date.now(),
        activeAddresses: Math.floor(Math.random() * 50000) + 10000,
        transactionCount: Math.floor(Math.random() * 200000) + 50000,
        newContracts: Math.floor(Math.random() * 50) + 5,
      }
      set((state) => ({
        onChainData: [...state.onChainData.filter(d => d.tokenId !== tokenId), mockData]
      }))
    } catch (error) {
      console.error('Failed to fetch on-chain data:', error)
    }
  },

  fetchTokenMetrics: async (tokenId) => {
    try {
      // This would fetch updated metrics from CoinGecko
      // For now, just refresh the existing data
      const { fetchTokens } = get()
      await fetchTokens()
    } catch (error) {
      console.error('Failed to fetch token metrics:', error)
    }
  },
}))

