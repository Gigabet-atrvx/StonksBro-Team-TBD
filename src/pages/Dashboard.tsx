import { useState, useEffect } from 'react';
import StockList from '../components/StockList';
import MainChart from '../components/MainChart';
import SentimentPanel from '../components/SentimentPanel';
import { StockService, Stock, ChartDataPoint, MarketSentiment } from '../services/StockService';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = StockService.generateHistoricalData(selectedStock, timeframe);
    setChartData(data);
  }, [selectedStock, timeframe]);

  const fetchData = async () => {
    const marketData = await StockService.fetchMarketData();
    const marketSentiment = await StockService.getGlobalMarketSentiment();

    setStocks(marketData);
    setSentiment(marketSentiment);
  };

  const handleTimeframeChange = (newTimeframe: '1D' | '1W' | '1M' | '3M' | '1Y') => {
    setTimeframe(newTimeframe);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Market Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time market data and analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MainChart
            data={chartData}
            symbol={selectedStock}
            onTimeframeChange={handleTimeframeChange}
          />

          {sentiment && <SentimentPanel sentiment={sentiment} />}
        </div>

        <div>
          <StockList stocks={stocks} />
        </div>
      </div>
    </motion.div>
  );
}
