import React from 'react';
import { TrendingUp, TrendingDown, MessageCircle, Hash } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SocialSentimentMeterProps {
  score: number;
  volume: number;
  variant?: 'gauge' | 'bar';
  className?: string;
}

export const SocialSentimentMeter: React.FC<SocialSentimentMeterProps> = ({
  score,
  volume,
  variant = 'gauge',
  className,
}) => {
  // Normalize score to 0-100 for display
  const normalizedScore = Math.max(0, Math.min(100, (score + 1) * 50));

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-success';
    if (score < -0.1) return 'text-warning';
    return 'text-text-secondary';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.2) return 'Very Positive';
    if (score > 0.1) return 'Positive';
    if (score < -0.2) return 'Very Negative';
    if (score < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.1) return <TrendingUp className="w-4 h-4" />;
    if (score < -0.1) return <TrendingDown className="w-4 h-4" />;
    return <MessageCircle className="w-4 h-4" />;
  };

  if (variant === 'bar') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Sentiment</span>
          <div className={cn("flex items-center space-x-1", getSentimentColor(score))}>
            {getSentimentIcon(score)}
            <span className="text-sm font-medium">{getSentimentLabel(score)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              score > 0 ? "bg-success" : score < 0 ? "bg-warning" : "bg-text-secondary"
            )}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Social Sentiment</span>
          </div>
          <div className={cn("flex items-center space-x-1", getSentimentColor(score))}>
            {getSentimentIcon(score)}
            <span className="text-sm font-medium">{score.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                score > 0 ? "bg-success" : score < 0 ? "bg-warning" : "bg-text-secondary"
              )}
              style={{ width: `${normalizedScore}%` }}
            />
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-5 bg-text-secondary rounded-full" />
        </div>

        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>Negative</span>
          <span className="text-center">Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-medium text-text-primary">
          {volume.toLocaleString()}
        </div>
        <div className="text-xs text-text-secondary">Mentions (24h)</div>
      </div>
    </div>
  );
};

