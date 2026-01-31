import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockService, Stock, ChartDataPoint } from '../services/StockService';
import { AnalysisService, TechnicalAnalysis } from '../services/AnalysisService';
import { motion } from 'framer-motion';

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      const stockData = await StockService.fetchStockDetail(symbol);
      setStock(stockData);

      const data = StockService.generateHistoricalData(symbol, timeframe);
      setChartData(data);

      const technicalAnalysis = AnalysisService.analyzeStock(symbol, data);
      setAnalysis(technicalAnalysis);
    };

    fetchData();
  }, [symbol, timeframe]);

  if (!stock || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all"
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stock.symbol}
          </h1>
          {isPositive ? (
            <TrendingUp size={32} style={{ color: 'var(--accent-green)' }} />
          ) : (
            <TrendingDown size={32} style={{ color: 'var(--accent-red)' }} />
          )}
        </div>
        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
          {stock.name}
        </p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            ${stock.price.toFixed(2)}
          </span>
          <span
            className="text-xl font-semibold"
            style={{
              color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            }}
          >
            {isPositive ? '+' : ''}
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Volume</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {(stock.volume / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="card">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Market Cap</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stock.marketCap}
          </p>
        </div>
        <div className="card">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trend</p>
          <p
            className="text-2xl font-bold capitalize"
            style={{
              color:
                analysis.trend === 'uptrend'
                  ? 'var(--accent-green)'
                  : analysis.trend === 'downtrend'
                  ? 'var(--accent-red)'
                  : 'var(--text-secondary)',
            }}
          >
            {analysis.trend}
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Price History
          </h2>

          <div className="flex gap-2">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: timeframe === tf ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  color: timeframe === tf ? 'white' : 'var(--text-secondary)',
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="time" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Technical Indicators
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RSI (14)</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    analysis.rsi > 70
                      ? 'var(--accent-red)'
                      : analysis.rsi < 30
                      ? 'var(--accent-green)'
                      : 'var(--text-primary)',
                }}
              >
                {analysis.rsi.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SMA 20</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                ${analysis.movingAverages.sma20.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SMA 50</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                ${analysis.movingAverages.sma50.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Support</span>
              <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>
                ${analysis.support.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Resistance</span>
              <span className="font-semibold" style={{ color: 'var(--accent-red)' }}>
                ${analysis.resistance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Smart Analysis
          </h2>

          {analysis.signals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No active signals at this time.</p>
          ) : (
            <div className="space-y-4">
              {analysis.signals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderLeft: `4px solid ${
                      signal.type === 'buy'
                        ? 'var(--accent-green)'
                        : signal.type === 'sell'
                        ? 'var(--accent-red)'
                        : 'var(--accent-blue)'
                    }`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-bold uppercase text-sm"
                      style={{
                        color:
                          signal.type === 'buy'
                            ? 'var(--accent-green)'
                            : signal.type === 'sell'
                            ? 'var(--accent-red)'
                            : 'var(--accent-blue)',
                      }}
                    >
                      {signal.type}
                    </span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {signal.strength}
                    </span>
                  </div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {signal.indicator}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {signal.explanation}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Overall Recommendation
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
