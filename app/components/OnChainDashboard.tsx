'use client';

import React, { useState, useEffect } from 'react';
import { OnChainStat } from './ui/OnChainStat';
import { generateMockOnChainData, simulateRealTimeUpdates } from '../utils/mockData';
import { OnChainActivity } from '../types';

interface OnChainDashboardProps {
  tokenId: string;
  tokenName: string;
}

export const OnChainDashboard: React.FC<OnChainDashboardProps> = ({
  tokenId,
  tokenName,
}) => {
  const [onChainData, setOnChainData] = useState<OnChainActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setOnChainData(generateMockOnChainData(tokenId));
    setIsLoading(false);

    // Set up real-time updates
    const cleanup = simulateRealTimeUpdates(({ onChainData: updatedData }) => {
      const tokenData = updatedData.find(data => data.tokenId === tokenId);
      if (tokenData) {
        setOnChainData(tokenData);
      }
    }, [tokenId]);

    return cleanup;
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!onChainData) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-gray-200">
        <p className="text-text-secondary">No on-chain data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        On-Chain Activity for {tokenName}
      </h3>

      <div className="space-y-4">
        <OnChainStat
          label="Active Addresses"
          value={onChainData.activeAddresses}
          change={Math.random() * 20 - 10} // Mock change percentage
        />

        <OnChainStat
          label="Transaction Count"
          value={onChainData.transactionCount}
          change={Math.random() * 15 - 7.5} // Mock change percentage
        />

        <OnChainStat
          label="New Contracts"
          value={onChainData.newContracts}
          change={Math.random() * 30 - 15} // Mock change percentage
        />

        {onChainData.gasUsed && (
          <OnChainStat
            label="Gas Used"
            value={onChainData.gasUsed}
            change={Math.random() * 25 - 12.5} // Mock change percentage
          />
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-text-secondary">Network Health</div>
              <div className="text-lg font-bold text-success">Good</div>
            </div>
            <div>
              <div className="text-sm font-medium text-text-secondary">Activity Level</div>
              <div className="text-lg font-bold text-accent">High</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-text-secondary pt-4 border-t border-gray-200">
          Last updated: {new Date(onChainData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

