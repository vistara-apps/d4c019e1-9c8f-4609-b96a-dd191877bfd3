'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTokenStore } from '../store/tokenStore'
import { TokenCard } from './TokenCard'

interface TokenSearchProps {
  onTokenSelect: (tokenId: string) => void
}

export function TokenSearch({ onTokenSelect }: TokenSearchProps) {
  const { tokens } = useTokenStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTokenSelect = (tokenId: string) => {
    onTokenSelect(tokenId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-text-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder-text-secondary"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && searchTerm && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-text-secondary/20 rounded-lg shadow-card max-h-96 overflow-y-auto">
          {filteredTokens.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  onClick={() => handleTokenSelect(token.id)}
                  className="cursor-pointer"
                >
                  <TokenCard token={token} compact />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-text-secondary">
              No tokens found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

