'use client'

import { useEffect } from 'react'
import { MessageCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useTokenStore } from '../store/tokenStore'
import { SocialSentimentMeter } from './SocialSentimentMeter'

interface SocialSentimentProps {
  tokenId: string
}

export function SocialSentiment({ tokenId }: SocialSentimentProps) {
  const { socialData, fetchSocialData } = useTokenStore()

  useEffect(() => {
    fetchSocialData(tokenId)
  }, [tokenId, fetchSocialData])

  const data = socialData.find(d => d.tokenId === tokenId)

  if (!data) {
    return (
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-xl font-bold text-text-primary mb-4">Social Sentiment</h3>
        <div className="text-center py-8">
          <p className="text-body text-text-secondary">Loading social data...</p>
        </div>
      </div>
    )
  }

  const sentimentLabel = data.sentimentScore > 0.6 ? 'Bullish' : data.sentimentScore < 0.4 ? 'Bearish' : 'Neutral'
  const sentimentColor = data.sentimentScore > 0.6 ? 'text-success' : data.sentimentScore < 0.4 ? 'text-warning' : 'text-text-secondary'

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <h3 className="text-xl font-bold text-text-primary mb-6">Social Sentiment</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Score */}
        <div className="space-y-4">
          <div>
            <p className="text-caption text-text-secondary mb-2">Sentiment Score</p>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-bold ${sentimentColor}`}>
                {(data.sentimentScore * 100).toFixed(1)}%
              </span>
              <span className={`text-sm font-medium ${sentimentColor}`}>
                {sentimentLabel}
              </span>
            </div>
          </div>

          <SocialSentimentMeter score={data.sentimentScore} />
        </div>

        {/* Post Volume */}
        <div className="space-y-4">
          <div>
            <p className="text-caption text-text-secondary mb-2">Post Volume (24h)</p>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-accent" />
              <span className="text-2xl font-bold text-text-primary">
                {data.postVolume.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Activity Level</span>
              <span className="text-text-primary font-medium">
                {data.postVolume > 1000 ? 'High' : data.postVolume > 500 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="w-full bg-bg rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((data.postVolume / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-bg rounded-lg">
        <h4 className="text-lg font-semibold text-text-primary mb-2">Market Insights</h4>
        <div className="space-y-2 text-sm text-text-secondary">
          {data.sentimentScore > 0.6 && data.postVolume > 800 && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span>Strong positive sentiment with high social activity - potential upward momentum</span>
            </div>
          )}
          {data.sentimentScore < 0.4 && data.postVolume > 800 && (
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <span>Bearish sentiment with high discussion volume - monitor closely</span>
            </div>
          )}
          {data.postVolume < 300 && (
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-text-secondary" />
              <span>Low social activity - limited community engagement</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

