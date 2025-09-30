import { SocialData, OnChainActivity } from '../types';

// Mock social sentiment data generator
export const generateMockSocialData = (tokenId: string): SocialData => {
  const sentimentScore = (Math.random() - 0.5) * 2; // -1 to 1
  const postVolume = Math.floor(Math.random() * 10000) + 1000; // 1000-11000

  return {
    tokenId,
    timestamp: Date.now(),
    sentimentScore,
    postVolume,
    platform: 'all', // Combined from all platforms
  };
};

// Mock on-chain activity data generator
export const generateMockOnChainData = (tokenId: string): OnChainActivity => {
  return {
    tokenId,
    timestamp: Date.now(),
    activeAddresses: Math.floor(Math.random() * 50000) + 10000, // 10000-60000
    transactionCount: Math.floor(Math.random() * 100000) + 50000, // 50000-150000
    newContracts: Math.floor(Math.random() * 50) + 10, // 10-60
    gasUsed: Math.floor(Math.random() * 1000000000) + 500000000, // 500M-1.5B
  };
};

// Generate trending social data for popular tokens
export const getMockTrendingSocialData = (tokenIds: string[]): SocialData[] => {
  return tokenIds.map(id => generateMockSocialData(id));
};

// Generate on-chain data for popular tokens
export const getMockOnChainData = (tokenIds: string[]): OnChainActivity[] => {
  return tokenIds.map(id => generateMockOnChainData(id));
};

// Simulate real-time updates
export const simulateRealTimeUpdates = (
  callback: (data: { socialData: SocialData[]; onChainData: OnChainActivity[] }) => void,
  tokenIds: string[]
) => {
  const interval = setInterval(() => {
    const socialData = getMockTrendingSocialData(tokenIds);
    const onChainData = getMockOnChainData(tokenIds);
    callback({ socialData, onChainData });
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
};
