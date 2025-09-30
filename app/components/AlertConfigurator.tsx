'use client'

import { useState } from 'react'
import { X, Bell } from 'lucide-react'
import { useTokenStore } from '../store/tokenStore'
import { Alert } from '../types'

interface AlertConfiguratorProps {
  tokenId: string
  onClose: () => void
}

export function AlertConfigurator({ tokenId, onClose }: AlertConfiguratorProps) {
  const { tokens, addAlert } = useTokenStore()
  const [alertType, setAlertType] = useState<'price' | 'volume'>('price')
  const [threshold, setThreshold] = useState('')
  const [comparison, setComparison] = useState<'<' | '>'>('>')

  const token = tokens.find(t => t.id === tokenId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!threshold || !token) return

    const newAlert: Alert = {
      id: `${tokenId}-${Date.now()}`,
      tokenId,
      alertType,
      threshold: parseFloat(threshold),
      comparison,
      status: 'active',
      createdAt: Date.now(),
    }

    addAlert(newAlert)
    onClose()
  }

  if (!token) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-text-primary">Set Alert</h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Token: {token.name} ({token.symbol})
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Alert Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="price"
                  checked={alertType === 'price'}
                  onChange={(e) => setAlertType(e.target.value as 'price')}
                  className="mr-2"
                />
                Price Alert
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="volume"
                  checked={alertType === 'volume'}
                  onChange={(e) => setAlertType(e.target.value as 'volume')}
                  className="mr-2"
                />
                Volume Alert
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Condition
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={comparison}
                onChange={(e) => setComparison(e.target.value as '<' | '>')}
                className="px-3 py-2 bg-bg border border-text-secondary/20 rounded-md text-text-primary"
              >
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
              </select>
              <input
                type="number"
                placeholder={alertType === 'price' ? `$${token.priceUsd}` : 'Volume amount'}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="flex-1 px-3 py-2 bg-bg border border-text-secondary/20 rounded-md text-text-primary placeholder-text-secondary"
                step={alertType === 'price' ? '0.01' : '1'}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg border border-text-secondary/20 rounded-md text-text-primary hover:bg-bg/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent text-surface rounded-md hover:bg-accent/80 transition-colors"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

