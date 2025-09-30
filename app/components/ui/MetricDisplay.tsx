import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MetricDisplayProps } from '../../types';
import { cn } from '../../utils/cn';

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  change,
  format = 'number',
  withTrendIcon = false,
}) => {
  const formatValue = (val: string | number, fmt: string) => {
    if (typeof val === 'string') return val;

    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(val);
      case 'percentage':
        return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
    }
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-text-secondary';
    return change >= 0 ? 'text-success' : 'text-warning';
  };

  const getTrendIcon = (change?: number) => {
    if (!change || !withTrendIcon) return null;
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-success" />
    ) : (
      <TrendingDown className="w-4 h-4 text-warning" />
    );
  };

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold text-text-primary">
          {formatValue(value, format)}
        </span>
        {change !== undefined && (
          <div className={cn("flex items-center space-x-1", getChangeColor(change))}>
            {getTrendIcon(change)}
            <span className="text-sm font-medium">
              {formatValue(change, 'percentage')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

