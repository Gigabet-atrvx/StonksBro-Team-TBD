export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}

export interface MarketSentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  description: string;
  indicators: {
    advancing: number;
    declining: number;
    unchanged: number;
  };
}

class StockServiceClass {
  private simulationMode = true;
  private baseStocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: 52000000, marketCap: '2.8T' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.89, change: -1.23, changePercent: -0.30, volume: 31000000, marketCap: '3.1T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.23, change: 0.87, changePercent: 0.62, volume: 28000000, marketCap: '1.8T' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.92, change: 3.45, changePercent: 1.97, volume: 45000000, marketCap: '1.9T' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.56, change: -5.67, changePercent: -2.28, volume: 98000000, marketCap: '770B' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.34, change: 12.45, changePercent: 1.44, volume: 42000000, marketCap: '2.2T' },
    { symbol: 'META', name: 'Meta Platforms', price: 498.23, change: 8.12, changePercent: 1.66, volume: 24000000, marketCap: '1.3T' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 421.34, change: 1.23, changePercent: 0.29, volume: 3500000, marketCap: '920B' },
  ];

  private generateRealisticFluctuation(basePrice: number): number {
    const volatility = 0.015;
    const change = (Math.random() - 0.5) * 2 * volatility;
    return basePrice * (1 + change);
  }

  async fetchMarketData(): Promise<Stock[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedStocks = this.baseStocks.map(stock => {
          const newPrice = this.generateRealisticFluctuation(stock.price);
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: stock.volume + Math.floor((Math.random() - 0.5) * 1000000),
          };
        });

        this.baseStocks = updatedStocks;
        resolve(updatedStocks);
      }, 500);
    });
  }

  async fetchStockDetail(symbol: string): Promise<Stock | null> {
    const stocks = await this.fetchMarketData();
    return stocks.find(s => s.symbol === symbol) || null;
  }

  generateHistoricalData(symbol: string, timeframe: '1D' | '1W' | '1M' | '3M' | '1Y'): ChartDataPoint[] {
    const stock = this.baseStocks.find(s => s.symbol === symbol);
    if (!stock) return [];

    const dataPoints: number = {
      '1D': 78,
      '1W': 35,
      '1M': 30,
      '3M': 60,
      '1Y': 252,
    }[timeframe];

    const data: ChartDataPoint[] = [];
    let currentPrice = stock.price * 0.95;
    const now = new Date();

    for (let i = dataPoints; i >= 0; i--) {
      const volatility = 0.02;
      const trend = 0.0002;
      const change = (Math.random() - 0.5) * volatility + trend;
      currentPrice = currentPrice * (1 + change);

      let time: Date;
      if (timeframe === '1D') {
        time = new Date(now.getTime() - i * 5 * 60000);
      } else if (timeframe === '1W') {
        time = new Date(now.getTime() - i * 4 * 3600000);
      } else if (timeframe === '1M') {
        time = new Date(now.getTime() - i * 24 * 3600000);
      } else if (timeframe === '3M') {
        time = new Date(now.getTime() - i * 36 * 3600000);
      } else {
        time = new Date(now.getTime() - i * 24 * 3600000);
      }

      data.push({
        time: timeframe === '1D'
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      });
    }

    return data;
  }

  async getGlobalMarketSentiment(): Promise<MarketSentiment> {
    const stocks = await this.fetchMarketData();
    const advancing = stocks.filter(s => s.change > 0).length;
    const declining = stocks.filter(s => s.change < 0).length;
    const unchanged = stocks.length - advancing - declining;

    const score = ((advancing - declining) / stocks.length) * 100;

    let sentiment: 'bullish' | 'bearish' | 'neutral';
    let description: string;

    if (score > 20) {
      sentiment = 'bullish';
      description = 'Strong buying pressure across major stocks. Market momentum is positive.';
    } else if (score < -20) {
      sentiment = 'bearish';
      description = 'Selling pressure dominant. Market showing signs of weakness.';
    } else {
      sentiment = 'neutral';
      description = 'Mixed signals. Market is consolidating with no clear direction.';
    }

    return {
      sentiment,
      score: parseFloat(score.toFixed(1)),
      description,
      indicators: { advancing, declining, unchanged },
    };
  }
}

export const StockService = new StockServiceClass();
