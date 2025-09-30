'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { Token, SearchResult } from './types';
import { getMarketData, searchTokens, POPULAR_TOKENS } from './utils/coingecko';
import { TokenCard } from './components/ui/TokenCard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AlertConfigurator } from './components/ui/AlertConfigurator';
import { AlertList } from './components/ui/AlertList';
import { SocialDashboard } from './components/SocialDashboard';
import { OnChainDashboard } from './components/OnChainDashboard';

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showAlertConfigurator, setShowAlertConfigurator] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'social' | 'onchain'>('overview');

  // Load popular tokens on mount
  useEffect(() => {
    loadPopularTokens();
  }, []);

  const loadPopularTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await getMarketData('usd', POPULAR_TOKENS);

      if (error) {
        setError(error.message);
      } else {
        setTokens(data || []);
      }
    } catch (err) {
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { data, error } = await searchTokens(query);

      if (error) {
        console.error('Search error:', error);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTokenSelect = async (token: Token | SearchResult) => {
    try {
      // If it's a search result, fetch full token data
      if ('thumb' in token) {
        const { data } = await getMarketData('usd', [token.id]);
        if (data && data.length > 0) {
          setSelectedToken(data[0]);
        }
      } else {
        setSelectedToken(token);
      }
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Failed to load token details:', err);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedToken(null);
  };

  if (selectedToken) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={handleBackToDashboard}
            className="mb-6 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ← Back to Dashboard
          </button>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'social', label: 'Social Sentiment', icon: '💬' },
                  { id: 'onchain', label: 'On-Chain Activity', icon: '⛓️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'overview' && (
              <>
                <div className="lg:col-span-2">
                  <TokenCard token={selectedToken} variant="detailed" />
                </div>
                <div className="space-y-4">
                  <div className="bg-surface p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAlertConfigurator(true)}
                        className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Set Price Alert
                      </button>
                      <button
                        onClick={() => setActiveTab('social')}
                        className="w-full px-4 py-2 bg-surface border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Social Sentiment
                      </button>
                      <button
                        onClick={() => setActiveTab('onchain')}
                        className="w-full px-4 py-2 bg-surface border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        On-Chain Activity
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface p-6 rounded-lg border border-gray-200">
                    <AlertList tokenId={selectedToken.address} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'social' && (
              <div className="lg:col-span-3">
                <SocialDashboard tokenId={selectedToken.address} tokenName={selectedToken.name} />
              </div>
            )}

            {activeTab === 'onchain' && (
              <div className="lg:col-span-3">
                <OnChainDashboard tokenId={selectedToken.address} tokenName={selectedToken.name} />
              </div>
            )}
          </div>

          {/* Alert Configurator Modal */}
          {showAlertConfigurator && selectedToken && (
            <AlertConfigurator
              tokenId={selectedToken.address}
              tokenName={selectedToken.name}
              currentPrice={selectedToken.priceUsd}
              onClose={() => setShowAlertConfigurator(false)}
              onAlertCreated={() => {
                // Refresh alerts will happen automatically via useEffect in AlertList
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Token Pulse</h1>
              <p className="text-text-secondary mt-1">Real-time Web3 insights, delivered instantly</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium text-text-secondary">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-2 w-full max-w-md bg-surface border border-gray-300 rounded-lg shadow-lg">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleTokenSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-primary border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <img
                    src={result.thumb}
                    alt={result.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-text-primary">{result.name}</div>
                    <div className="text-sm text-text-secondary">{result.symbol.toUpperCase()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <h3 className="font-medium text-text-primary">Error Loading Data</h3>
              <p className="text-sm text-text-secondary">{error}</p>
            </div>
            <button
              onClick={loadPopularTokens}
              className="ml-auto px-3 py-1 bg-warning text-white rounded text-sm hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-text-secondary">Loading token data...</p>
            </div>
          </div>
        )}

        {/* Token Grid */}
        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Popular Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <TokenCard
                  key={token.address}
                  token={token}
                  onSelect={handleTokenSelect}
                  variant="detailed"
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
