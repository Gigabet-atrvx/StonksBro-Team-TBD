import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketSentiment } from '../services/StockService';
import { motion } from 'framer-motion';

interface SentimentPanelProps {
  sentiment: MarketSentiment;
}

export default function SentimentPanel({ sentiment }: SentimentPanelProps) {
  const getSentimentColor = () => {
    switch (sentiment.sentiment) {
      case 'bullish':
        return 'var(--accent-green)';
      case 'bearish':
        return 'var(--accent-red)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment.sentiment) {
      case 'bullish':
        return <TrendingUp size={32} />;
      case 'bearish':
        return <TrendingDown size={32} />;
      default:
        return <Minus size={32} />;
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Market Sentiment
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ color: getSentimentColor() }}
        >
          {getSentimentIcon()}
        </motion.div>

        <div>
          <h3
            className="text-2xl font-bold capitalize"
            style={{ color: getSentimentColor() }}
          >
            {sentiment.sentiment}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Score: {sentiment.score > 0 ? '+' : ''}
            {sentiment.score}
          </p>
        </div>
      </div>

      <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
        {sentiment.description}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Advancing
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent-green)' }}>
            {sentiment.indicators.advancing}
          </p>
        </div>

        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Declining
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent-red)' }}>
            {sentiment.indicators.declining}
          </p>
        </div>

        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Unchanged
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>
            {sentiment.indicators.unchanged}
          </p>
        </div>
      </div>
    </div>
  );
}
