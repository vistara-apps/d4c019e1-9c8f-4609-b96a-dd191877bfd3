'use client'

interface SocialSentimentMeterProps {
  score: number // 0-1 scale
}

export function SocialSentimentMeter({ score }: SocialSentimentMeterProps) {
  const getColor = (score: number) => {
    if (score >= 0.6) return 'text-success'
    if (score <= 0.4) return 'text-warning'
    return 'text-text-secondary'
  }

  const getBgColor = (score: number) => {
    if (score >= 0.6) return 'bg-success'
    if (score <= 0.4) return 'bg-warning'
    return 'bg-text-secondary'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Bearish</span>
        <span className="text-text-secondary">Neutral</span>
        <span className="text-text-secondary">Bullish</span>
      </div>
      <div className="relative">
        <div className="w-full h-3 bg-bg rounded-full">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getBgColor(score)}`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
        <div
          className="absolute top-0 w-1 h-3 bg-text-primary rounded-full transform -translate-x-0.5"
          style={{ left: `${score * 100}%` }}
        />
      </div>
      <div className="text-center">
        <span className={`text-sm font-medium ${getColor(score)}`}>
          {score >= 0.6 ? 'Bullish' : score <= 0.4 ? 'Bearish' : 'Neutral'}
        </span>
      </div>
    </div>
  )
}

