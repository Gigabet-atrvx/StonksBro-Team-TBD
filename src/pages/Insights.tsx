import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Target, Brain } from 'lucide-react';
import { StockService, Stock } from '../services/StockService';
import { motion } from 'framer-motion';

export default function Insights() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const marketData = await StockService.fetchMarketData();
    setStocks(marketData);
  };

  const sectorData = [
    { name: 'Technology', value: 35, color: 'var(--accent-blue)' },
    { name: 'Finance', value: 20, color: 'var(--accent-green)' },
    { name: 'Healthcare', value: 15, color: '#f59e0b' },
    { name: 'Consumer', value: 18, color: '#8b5cf6' },
    { name: 'Energy', value: 12, color: '#ef4444' },
  ];

  const performanceData = stocks.map((stock) => ({
    name: stock.symbol,
    performance: stock.changePercent,
  }));

  const insights = [
    {
      icon: TrendingUp,
      title: 'Bullish Momentum',
      description: 'Tech sector showing strong momentum with NVDA and MSFT leading gains.',
      color: 'var(--accent-green)',
    },
    {
      icon: AlertCircle,
      title: 'Volatility Alert',
      description: 'TSLA experiencing high volatility. Consider setting stop-loss orders.',
      color: 'var(--accent-red)',
    },
    {
      icon: Target,
      title: 'Buying Opportunity',
      description: 'AAPL near support levels. Historical data suggests potential bounce.',
      color: 'var(--accent-blue)',
    },
    {
      icon: Brain,
      title: 'AI Trend',
      description: 'AI-related stocks outperforming broader market by 15% this quarter.',
      color: '#8b5cf6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Market Insights
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Deep analysis and trends across the market
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <Icon size={24} style={{ color: insight.color }} />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {insight.title}
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {insight.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Performance Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
              />
              <Bar
                dataKey="performance"
                fill="var(--accent-blue)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Sector Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Key Market Themes
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Artificial Intelligence Revolution
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              AI-related stocks continue to dominate market gains. NVDA leads with strong data center demand,
              while software companies integrating AI see increased valuations.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                High Growth
              </span>
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                Long-term Trend
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Electric Vehicle Market Evolution
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              EV sector experiencing consolidation phase. Market leaders like TSLA face increased competition
              but maintain technological advantages. Watch for Q4 delivery numbers.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                Moderate Risk
              </span>
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--text-secondary)', color: 'white' }}>
                Sector Rotation
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Cloud Computing Maturation
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Cloud infrastructure providers showing steady growth. AMZN AWS, MSFT Azure, and GOOGL Cloud
              Platform reporting strong enterprise adoption. Margins improving as scale increases.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                Stable Growth
              </span>
              <span className="px-3 py-1 rounded text-xs" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                Defensive Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
