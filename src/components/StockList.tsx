import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '../services/StockService';
import { motion } from 'framer-motion';

interface StockListProps {
  stocks: Stock[];
}

export default function StockList({ stocks }: StockListProps) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Market Movers
      </h2>

      <div className="space-y-2">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/stock/${stock.symbol}`)}
            className="p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderLeft: `4px solid ${stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stock.symbol}
                  </span>
                  {stock.change >= 0 ? (
                    <TrendingUp size={20} style={{ color: 'var(--accent-green)' }} />
                  ) : (
                    <TrendingDown size={20} style={{ color: 'var(--accent-red)' }} />
                  )}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stock.name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${stock.price.toFixed(2)}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{
                    color: stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}
                >
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t flex justify-between text-xs" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Vol: {(stock.volume / 1000000).toFixed(1)}M
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Cap: {stock.marketCap}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
