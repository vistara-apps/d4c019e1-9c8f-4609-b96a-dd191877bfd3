'use client';

import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { AlertConfig } from '../../types';
import { createAlert } from '../../utils/alerts';
import { cn } from '../../utils/cn';

interface AlertConfiguratorProps {
  tokenId: string;
  tokenName: string;
  currentPrice: number;
  onClose: () => void;
  onAlertCreated: () => void;
}

export const AlertConfigurator: React.FC<AlertConfiguratorProps> = ({
  tokenId,
  tokenName,
  currentPrice,
  onClose,
  onAlertCreated,
}) => {
  const [alertType, setAlertType] = useState<'price' | 'volume'>('price');
  const [threshold, setThreshold] = useState('');
  const [comparison, setComparison] = useState<'<' | '>' | '<=' | '>='>('>');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const thresholdValue = parseFloat(threshold);
    if (isNaN(thresholdValue)) return;

    setIsSubmitting(true);

    try {
      const config: AlertConfig = {
        tokenId,
        type: alertType,
        threshold: thresholdValue,
        comparison,
      };

      createAlert(config);
      onAlertCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThresholdPlaceholder = () => {
    if (alertType === 'price') {
      return `e.g., ${currentPrice * 1.05} (5% above current)`;
    }
    return 'Enter volume threshold';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text-primary">
              Set Alert for {tokenName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Alert Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setAlertType('price')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  alertType === 'price'
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                )}
              >
                Price
              </button>
              <button
                type="button"
                onClick={() => setAlertType('volume')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  alertType === 'volume'
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                )}
              >
                Volume
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Condition
            </label>
            <div className="flex space-x-2">
              {(['>', '<', '>=', '<='] as const).map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setComparison(comp)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    comparison === comp
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  )}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Threshold Value
            </label>
            <input
              type="number"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={getThresholdPlaceholder()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
            {alertType === 'price' && (
              <p className="text-xs text-text-secondary mt-1">
                Current price: ${currentPrice.toFixed(6)}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-text-secondary rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !threshold}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

