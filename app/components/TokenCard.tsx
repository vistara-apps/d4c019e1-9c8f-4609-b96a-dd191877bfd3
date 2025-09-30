'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Token } from '../types'

interface TokenCardProps {
  token: Token
  onClick?: () => void
  compact?: boolean
}

export function TokenCard({ token, onClick, compact = false }: TokenCardProps) {
  const priceChange = token.priceHistory.length > 1
    ? ((token.priceHistory[token.priceHistory.length - 1].price - token.priceHistory[0].price) / token.priceHistory[0].price) * 100
    : 0

  const isPositive = priceChange >= 0

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-surface rounded-lg p-4 shadow-card hover:shadow-card hover:scale-105 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-surface">{token.symbol.slice(0, 2)}</span>
            </div>
            <div>
              <p className="font-semibold text-text-primary">{token.symbol}</p>
              <p className="text-sm text-text-secondary">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-text-primary">${token.priceUsd.toLocaleString()}</p>
            <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-warning'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-lg p-6 shadow-card hover:shadow-card hover:scale-105 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-surface">{token.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">{token.name}</h3>
            <p className="text-caption text-text-secondary">{token.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center text-lg font-bold ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
          {Math.abs(priceChange).toFixed(2)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-caption text-text-secondary">Price</p>
          <p className="text-xl font-bold text-text-primary">${token.priceUsd.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary">Market Cap</p>
          <p className="text-xl font-bold text-text-primary">${(token.marketCap / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary">24h Volume</p>
          <p className="text-xl font-bold text-text-primary">${(token.volume24h / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-caption text-text-secondary">Supply</p>
          <p className="text-xl font-bold text-text-primary">{(token.circulatingSupply / 1e6).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  )
}

