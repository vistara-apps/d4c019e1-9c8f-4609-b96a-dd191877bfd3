'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Bell, DollarSign, BarChart3, Users } from 'lucide-react'
import { useTokenStore } from '../store/tokenStore'
import { TokenCard } from './TokenCard'
import { MetricDisplay } from './MetricDisplay'
import { PriceChart } from './PriceChart'

interface TokenDashboardProps {
  tokenId: string
  onSetAlert: () => void
}

export function TokenDashboard({ tokenId, onSetAlert }: TokenDashboardProps) {
  const { tokens, fetchTokenMetrics, fetchSocialData, fetchOnChainData } = useTokenStore()
  const [refreshing, setRefreshing] = useState(false)

  const token = tokens.find(t => t.id === tokenId)

  useEffect(() => {
    if (tokenId) {
      fetchSocialData(tokenId)
      fetchOnChainData(tokenId)
    }
  }, [tokenId, fetchSocialData, fetchOnChainData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTokenMetrics(tokenId)
    setRefreshing(false)
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-body text-text-secondary">Token not found</p>
      </div>
    )
  }

  const priceChange = token.priceHistory.length > 1
    ? ((token.priceHistory[token.priceHistory.length - 1].price - token.priceHistory[0].price) / token.priceHistory[0].price) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-surface">{token.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h2 className="text-heading font-bold text-text-primary">{token.name}</h2>
            <p className="text-caption text-text-secondary">{token.symbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-accent text-surface rounded-md hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={onSetAlert}
            className="px-4 py-2 bg-primary text-surface rounded-md hover:bg-primary/80 transition-colors flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Set Alert</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Price"
          value={`$${token.priceUsd.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={priceChange}
        />
        <MetricDisplay
          label="Market Cap"
          value={`$${(token.marketCap / 1e9).toFixed(2)}B`}
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricDisplay
          label="24h Volume"
          value={`$${(token.volume24h / 1e9).toFixed(2)}B`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricDisplay
          label="Circulating Supply"
          value={`${(token.circulatingSupply / 1e6).toFixed(2)}M`}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Price Chart */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-xl font-bold text-text-primary mb-4">Price History (24h)</h3>
        <PriceChart data={token.priceHistory} />
      </div>
    </div>
  )
}

