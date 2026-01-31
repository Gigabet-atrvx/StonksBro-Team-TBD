import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../services/StockService';

interface MainChartProps {
  data: ChartDataPoint[];
  symbol: string;
  onTimeframeChange?: (timeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => void;
}

export default function MainChart({ data, symbol, onTimeframeChange }: MainChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

  const handleTimeframeChange = (newTimeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => {
    setTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  const isPositive = data.length > 1 && data[data.length - 1].price > data[0].price;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {symbol} Price Chart
        </h2>

        <div className="flex gap-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
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

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="time"
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
