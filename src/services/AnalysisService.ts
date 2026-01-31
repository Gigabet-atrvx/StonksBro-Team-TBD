import { ChartDataPoint } from './StockService';

export interface Signal {
  type: 'buy' | 'sell' | 'hold';
  strength: 'strong' | 'moderate' | 'weak';
  price: number;
  indicator: string;
  explanation: string;
}

export interface TechnicalAnalysis {
  signals: Signal[];
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
  rsi: number;
  trend: 'uptrend' | 'downtrend' | 'sideways';
  support: number;
  resistance: number;
  recommendation: string;
}

class AnalysisServiceClass {
  calculateSMA(data: ChartDataPoint[], period: number): number {
    if (data.length < period) return data[data.length - 1]?.price || 0;

    const recentData = data.slice(-period);
    const sum = recentData.reduce((acc, point) => acc + point.price, 0);
    return parseFloat((sum / period).toFixed(2));
  }

  calculateRSI(data: ChartDataPoint[], period: number = 14): number {
    if (data.length < period + 1) return 50;

    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i].price - data[i - 1].price);
    }

    const recentChanges = changes.slice(-period);
    const gains = recentChanges.filter(c => c > 0);
    const losses = recentChanges.filter(c => c < 0).map(c => Math.abs(c));

    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return parseFloat(rsi.toFixed(2));
  }

  detectSMACrossover(data: ChartDataPoint[], currentPrice: number): Signal | null {
    const sma20 = this.calculateSMA(data, 20);
    const sma50 = this.calculateSMA(data, 50);

    if (data.length < 50) return null;

    const prevData = data.slice(0, -1);
    const prevSma20 = this.calculateSMA(prevData, 20);
    const prevSma50 = this.calculateSMA(prevData, 50);

    if (prevSma20 < prevSma50 && sma20 > sma50) {
      return {
        type: 'buy',
        strength: 'strong',
        price: currentPrice,
        indicator: 'Golden Cross (20/50 SMA)',
        explanation: 'The 20-day SMA has crossed above the 50-day SMA, indicating bullish momentum. This is a strong buy signal suggesting the start of an uptrend.',
      };
    }

    if (prevSma20 > prevSma50 && sma20 < sma50) {
      return {
        type: 'sell',
        strength: 'strong',
        price: currentPrice,
        indicator: 'Death Cross (20/50 SMA)',
        explanation: 'The 20-day SMA has crossed below the 50-day SMA, indicating bearish momentum. This is a strong sell signal suggesting potential downtrend.',
      };
    }

    return null;
  }

  analyzeStock(symbol: string, data: ChartDataPoint[]): TechnicalAnalysis {
    if (data.length === 0) {
      return {
        signals: [],
        movingAverages: { sma20: 0, sma50: 0, sma200: 0 },
        rsi: 50,
        trend: 'sideways',
        support: 0,
        resistance: 0,
        recommendation: 'Insufficient data for analysis',
      };
    }

    const currentPrice = data[data.length - 1].price;
    const sma20 = this.calculateSMA(data, 20);
    const sma50 = this.calculateSMA(data, 50);
    const sma200 = this.calculateSMA(data, 200);
    const rsi = this.calculateRSI(data);

    const signals: Signal[] = [];

    const crossoverSignal = this.detectSMACrossover(data, currentPrice);
    if (crossoverSignal) {
      signals.push(crossoverSignal);
    }

    if (rsi > 70) {
      signals.push({
        type: 'sell',
        strength: 'moderate',
        price: currentPrice,
        indicator: 'RSI Overbought',
        explanation: `RSI is at ${rsi.toFixed(1)}, indicating the stock is overbought. Consider taking profits or waiting for a pullback.`,
      });
    } else if (rsi < 30) {
      signals.push({
        type: 'buy',
        strength: 'moderate',
        price: currentPrice,
        indicator: 'RSI Oversold',
        explanation: `RSI is at ${rsi.toFixed(1)}, indicating the stock is oversold. This could be a good buying opportunity as price may bounce back.`,
      });
    }

    if (currentPrice > sma20 && sma20 > sma50) {
      signals.push({
        type: 'hold',
        strength: 'moderate',
        price: currentPrice,
        indicator: 'Uptrend Confirmed',
        explanation: 'Price is above both 20-day and 50-day SMAs. The uptrend remains intact. Hold your position or add on dips.',
      });
    }

    const prices = data.map(d => d.price);
    const recentPrices = prices.slice(-20);
    const support = Math.min(...recentPrices);
    const resistance = Math.max(...recentPrices);

    let trend: 'uptrend' | 'downtrend' | 'sideways';
    if (sma20 > sma50 && currentPrice > sma20) {
      trend = 'uptrend';
    } else if (sma20 < sma50 && currentPrice < sma20) {
      trend = 'downtrend';
    } else {
      trend = 'sideways';
    }

    const buySignals = signals.filter(s => s.type === 'buy').length;
    const sellSignals = signals.filter(s => s.type === 'sell').length;

    let recommendation: string;
    if (buySignals > sellSignals) {
      recommendation = 'Overall bullish outlook. Consider accumulating on pullbacks.';
    } else if (sellSignals > buySignals) {
      recommendation = 'Bearish signals present. Consider reducing exposure or setting stop losses.';
    } else {
      recommendation = 'Neutral stance. Wait for clearer signals before making significant moves.';
    }

    return {
      signals,
      movingAverages: { sma20, sma50, sma200 },
      rsi,
      trend,
      support: parseFloat(support.toFixed(2)),
      resistance: parseFloat(resistance.toFixed(2)),
      recommendation,
    };
  }
}

export const AnalysisService = new AnalysisServiceClass();
