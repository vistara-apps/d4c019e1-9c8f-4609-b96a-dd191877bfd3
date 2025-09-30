import React from 'react';
import Image from 'next/image';
import { TokenCardProps } from '../../types';
import { MetricDisplay } from './MetricDisplay';
import { cn } from '../../utils/cn';

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onSelect,
  variant = 'detailed',
}) => {
  const handleClick = () => {
    onSelect?.(token);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-200 cursor-pointer hover:shadow-card transition-shadow",
          onSelect && "hover:bg-primary"
        )}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3">
          {token.image && (
            <Image
              src={token.image}
              alt={token.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-text-primary">{token.name}</h3>
            <p className="text-sm text-text-secondary">{token.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-text-primary">
            ${token.priceUsd.toFixed(token.priceUsd < 1 ? 6 : 2)}
          </p>
          {token.priceChange24h && (
            <p className={cn(
              "text-sm font-medium",
              token.priceChange24h >= 0 ? "text-success" : "text-warning"
            )}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-6 bg-surface rounded-lg border border-gray-200 cursor-pointer hover:shadow-card transition-shadow",
        onSelect && "hover:bg-primary"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {token.image && (
            <Image
              src={token.image}
              alt={token.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h3 className="text-xl font-bold text-text-primary">{token.name}</h3>
            <p className="text-lg text-text-secondary">{token.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-primary">
            ${token.priceUsd.toFixed(token.priceUsd < 1 ? 6 : 2)}
          </p>
          {token.priceChange24h && (
            <MetricDisplay
              label=""
              value=""
              change={token.priceChange24h}
              format="percentage"
              withTrendIcon
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricDisplay
          label="Market Cap"
          value={token.marketCap}
          format="currency"
        />
        <MetricDisplay
          label="24h Volume"
          value={token.volume24h}
          format="currency"
        />
        <MetricDisplay
          label="Circulating Supply"
          value={token.circulatingSupply}
          format="number"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">24h Change</span>
          <span className={cn(
            "text-sm font-semibold",
            token.priceChange24h && token.priceChange24h >= 0 ? "text-success" : "text-warning"
          )}>
            {token.priceChange24h ? `${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

