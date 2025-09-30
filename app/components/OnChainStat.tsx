'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface OnChainStatProps {
  label: string
  value: string
  icon?: ReactNode
  change?: number
}

export function OnChainStat({ label, value, icon, change }: OnChainStatProps) {
  const hasChange = change !== undefined
  const isPositive = change ? change >= 0 : true

  return (
    <div className="bg-bg rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-caption text-text-secondary">{label}</p>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      <p className="text-lg font-bold text-text-primary mb-1">{value}</p>
      {hasChange && (
        <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  )
}

