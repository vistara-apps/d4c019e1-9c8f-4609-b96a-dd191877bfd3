'use client';

import React, { useState, useEffect } from 'react';
import { SocialSentimentMeter } from './ui/SocialSentimentMeter';
import { generateMockSocialData, simulateRealTimeUpdates } from '../utils/mockData';
import { SocialData } from '../types';

interface SocialDashboardProps {
  tokenId: string;
  tokenName: string;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({
  tokenId,
  tokenName,
}) => {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setSocialData(generateMockSocialData(tokenId));
    setIsLoading(false);

    // Set up real-time updates
    const cleanup = simulateRealTimeUpdates(({ socialData: updatedData }) => {
      const tokenData = updatedData.find(data => data.tokenId === tokenId);
      if (tokenData) {
        setSocialData(tokenData);
      }
    }, [tokenId]);

    return cleanup;
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!socialData) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-gray-200">
        <p className="text-text-secondary">No social data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Social Sentiment for {tokenName}
      </h3>

      <div className="space-y-4">
        <SocialSentimentMeter
          score={socialData.sentimentScore}
          volume={socialData.postVolume}
          variant="gauge"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {socialData.sentimentScore.toFixed(2)}
            </div>
            <div className="text-sm text-text-secondary">Sentiment Score</div>
            <div className="text-xs text-text-secondary mt-1">
              Range: -1 (negative) to +1 (positive)
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {socialData.postVolume.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">24h Mentions</div>
            <div className="text-xs text-text-secondary mt-1">
              Social media posts & discussions
            </div>
          </div>
        </div>

        <div className="text-xs text-text-secondary pt-4 border-t border-gray-200">
          Last updated: {new Date(socialData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

