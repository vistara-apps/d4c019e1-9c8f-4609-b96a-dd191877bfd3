# Token Pulse

Real-time Web3 insights, delivered instantly.

A mini app that provides real-time cryptocurrency metrics, price alerts, social sentiment analysis, and on-chain activity tracking for Web3 enthusiasts.

## Features

### ✅ Core Token Metrics Dashboard
- Real-time price, market cap, 24h volume, and circulating supply
- Interactive price charts with historical data
- Token search and discovery
- Responsive design optimized for mobile and desktop

### ✅ Customizable Price Alerts
- Set price alerts with custom thresholds and conditions
- Support for price and volume-based alerts
- Local storage persistence
- Alert management interface

### ✅ Social Sentiment Analysis
- Real-time sentiment scoring (-1 to +1 scale)
- Social media mention volume tracking
- Visual sentiment indicators and gauges
- Mock data with simulated real-time updates

### ✅ On-Chain Activity Tracking
- Active addresses monitoring
- Transaction count analysis
- New contract deployments
- Gas usage statistics
- Network health indicators

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **State Management**: Zustand for global state
- **API Integration**: CoinGecko API for market data
- **Icons**: Lucide React

## Design System

The app follows a custom design system with:
- **Colors**: Blue accent (#2563eb), success green, warning orange, surface white, text grays
- **Typography**: Clean, modern font hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable UI components with variants

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

### CoinGecko API
- **Purpose**: Real-time token prices, market data, and historical charts
- **Endpoints**: Markets, token details, price history
- **Rate Limits**: 50 calls/minute (free tier)
- **Caching**: 5-minute cache for performance

### Future Integrations
- **Alchemy SDK**: On-chain data and blockchain interactions
- **Social Media APIs**: Twitter/X API, Reddit API for sentiment analysis
- **Chainlink Oracles**: Decentralized price feeds

## Project Structure

```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── TokenCard.tsx
│   │   ├── MetricDisplay.tsx
│   │   ├── Graph.tsx
│   │   ├── AlertConfigurator.tsx
│   │   ├── AlertList.tsx
│   │   ├── SocialSentimentMeter.tsx
│   │   ├── OnChainStat.tsx
│   │   └── LoadingSpinner.tsx
│   ├── SocialDashboard.tsx
│   └── OnChainDashboard.tsx
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   ├── api.ts            # Base API utilities
│   ├── coingecko.ts      # CoinGecko API integration
│   ├── alerts.ts         # Alert management
│   ├── mockData.ts       # Mock data generators
│   └── cn.ts             # Class name utility
├── globals.css           # Global styles and design tokens
├── layout.tsx            # Root layout
└── page.tsx              # Main dashboard page
```

## Business Model

- **Current**: Freemium model with basic metrics free
- **Future**: Paid tiers for advanced alerts and premium analytics
- **Experimental Features**: Tokenized micro-transactions for specific actions

## Deployment

The app is designed as a Base Mini App and can be deployed to:
- Vercel (recommended for Next.js)
- Base network infrastructure
- Any static hosting with API routes support

## Contributing

1. Follow the established design system and component patterns
2. Add TypeScript interfaces for new data structures
3. Implement proper error handling and loading states
4. Test components across different screen sizes
5. Update documentation for new features

## License

This project is part of the Token Pulse Web3 application suite.

