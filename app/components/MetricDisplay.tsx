'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricDisplayProps {
  label: string
  value: string
  icon?: ReactNode
  trend?: number
  className?: string
}

export function MetricDisplay({ label, value, icon, trend, className = '' }: MetricDisplayProps) {
  const hasTrend = trend !== undefined
  const isPositive = trend ? trend >= 0 : true

  return (
    <div className={`bg-surface rounded-lg p-4 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-caption text-text-secondary">{label}</p>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      <p className="text-xl font-bold text-text-primary mb-1">{value}</p>
      {hasTrend && (
        <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </div>
  )
}

