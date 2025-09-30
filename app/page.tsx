'use client'

import { useState, useEffect } from 'react'
import { TokenDashboard } from './components/TokenDashboard'
import { TokenSearch } from './components/TokenSearch'
import { AlertConfigurator } from './components/AlertConfigurator'
import { SocialSentiment } from './components/SocialSentiment'
import { OnChainActivity } from './components/OnChainActivity'
import { useTokenStore } from './store/tokenStore'

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [showAlertConfigurator, setShowAlertConfigurator] = useState(false)
  const { tokens, fetchTokens, loading } = useTokenStore()

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId)
  }

  const handleSetAlert = () => {
    setShowAlertConfigurator(true)
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display font-semibold text-text-primary mb-2">
            Token Pulse
          </h1>
          <p className="text-body text-text-secondary">
            Real-time Web3 insights, delivered instantly.
          </p>
        </div>

        {/* Token Search */}
        <div className="mb-8">
          <TokenSearch onTokenSelect={handleTokenSelect} />
        </div>

        {/* Main Content */}
        {selectedToken ? (
          <div className="space-y-8">
            {/* Token Dashboard */}
            <TokenDashboard
              tokenId={selectedToken}
              onSetAlert={handleSetAlert}
            />

            {/* Social Sentiment */}
            <SocialSentiment tokenId={selectedToken} />

            {/* On-Chain Activity */}
            <OnChainActivity tokenId={selectedToken} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-body text-text-secondary">
              Select a token to view real-time metrics and insights
            </p>
          </div>
        )}

        {/* Alert Configurator Modal */}
        {showAlertConfigurator && selectedToken && (
          <AlertConfigurator
            tokenId={selectedToken}
            onClose={() => setShowAlertConfigurator(false)}
          />
        )}
      </div>
    </div>
  )
}

