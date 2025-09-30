import React from 'react';
import { Activity, Users, FileText, Zap } from 'lucide-react';
import { OnChainStatProps } from '../../types';
import { cn } from '../../utils/cn';

export const OnChainStat: React.FC<OnChainStatProps> = ({
  label,
  value,
  change,
  format = 'number',
}) => {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
      default:
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val);
    }
  };

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'active addresses':
        return <Users className="w-5 h-5 text-accent" />;
      case 'transaction count':
        return <Activity className="w-5 h-5 text-accent" />;
      case 'new contracts':
        return <FileText className="w-5 h-5 text-accent" />;
      case 'gas used':
        return <Zap className="w-5 h-5 text-accent" />;
      default:
        return <Activity className="w-5 h-5 text-accent" />;
    }
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-text-secondary';
    return change >= 0 ? 'text-success' : 'text-warning';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        {getIcon(label)}
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatValue(value, format)}
          </p>
        </div>
      </div>

      {change !== undefined && (
        <div className={cn("text-right", getChangeColor(change))}>
          <p className="text-sm font-medium">
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
};

