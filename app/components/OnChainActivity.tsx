'use client'

import { useEffect } from 'react'
import { Activity, Users, FileText, Zap } from 'lucide-react'
import { useTokenStore } from '../store/tokenStore'
import { OnChainStat } from './OnChainStat'

interface OnChainActivityProps {
  tokenId: string
}

export function OnChainActivity({ tokenId }: OnChainActivityProps) {
  const { onChainData, fetchOnChainData } = useTokenStore()

  useEffect(() => {
    fetchOnChainData(tokenId)
  }, [tokenId, fetchOnChainData])

  const data = onChainData.find(d => d.tokenId === tokenId)

  if (!data) {
    return (
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-xl font-bold text-text-primary mb-4">On-Chain Activity</h3>
        <div className="text-center py-8">
          <p className="text-body text-text-secondary">Loading on-chain data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <h3 className="text-xl font-bold text-text-primary mb-6">On-Chain Activity</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OnChainStat
          label="Active Addresses"
          value={data.activeAddresses.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          change={12.5} // Mock change percentage
        />
        <OnChainStat
          label="Transactions (24h)"
          value={data.transactionCount.toLocaleString()}
          icon={<Activity className="w-5 h-5" />}
          change={8.3}
        />
        <OnChainStat
          label="New Contracts"
          value={data.newContracts.toString()}
          icon={<FileText className="w-5 h-5" />}
          change={-2.1}
        />
        <OnChainStat
          label="Network Health"
          value="Good"
          icon={<Zap className="w-5 h-5" />}
          change={5.7}
        />
      </div>

      {/* Activity Insights */}
      <div className="mt-6 p-4 bg-bg rounded-lg">
        <h4 className="text-lg font-semibold text-text-primary mb-3">Network Insights</h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">High Network Activity</p>
              <p className="text-sm text-text-secondary">
                {data.activeAddresses.toLocaleString()} addresses active in the last 24 hours,
                indicating strong user engagement.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">Growing Ecosystem</p>
              <p className="text-sm text-text-secondary">
                {data.newContracts} new smart contracts deployed, showing continued development activity.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">Transaction Volume</p>
              <p className="text-sm text-text-secondary">
                {data.transactionCount.toLocaleString()} transactions processed, maintaining healthy network throughput.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

