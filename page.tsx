'use client';

import { useState } from 'react';

export default function TradingPage() {
  const [symbol, setSymbol] = useState('BTC/USD');
  const [amount, setAmount] = useState('');
  const [prediction, setPrediction] = useState<null | 'buy' | 'sell'>(null);
  const [confidence, setConfidence] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<Array<{
    id: number;
    symbol: string;
    type: string;
    amount: string;
    timestamp: string;
  }>>([]);

  const getAIPrediction = () => {
    const randomPrediction = Math.random() > 0.5 ? 'buy' : 'sell';
    const randomConfidence = Math.floor(Math.random() * 30) + 60;
    setPrediction(randomPrediction);
    setConfidence(randomConfidence);
  };

  const executeTrade = (type: 'buy' | 'sell') => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const newTrade = {
      id: Date.now(),
      symbol,
      type: type.toUpperCase(),
      amount: `$${amount}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setTradeHistory([newTrade, ...tradeHistory]);
    setAmount('');
    setPrediction(null);
    setConfidence(0);
    alert(`${type.toUpperCase()} order placed for ${amount} USD`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>🤖 AI Trading Assistant</h1>
        <p style={{ color: '#9CA3AF' }}>Powered by Machine Learning</p>
      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          
          {/* AI Prediction Card */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#1F2937', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🧠 AI Market Analysis</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Trading Pair</label>
              <select 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                style={{ width: '100%', backgroundColor: '#374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'white', border: '1px solid #4B5563' }}
              >
                <option>BTC/USD</option>
                <option>ETH/USD</option>
                <option>SOL/USD</option>
                <option>DOGE/USD</option>
              </select>
            </div>

            <button
              onClick={getAIPrediction}
              style={{ width: '100%', backgroundColor: '#2563EB', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: '600', color: 'white', cursor: 'pointer' }}
            >
              🔮 Get AI Prediction
            </button>

            {prediction && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>AI Recommendation:</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: prediction === 'buy' ? '#10B981' : '#EF4444' }}>
                  {prediction.toUpperCase()}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Confidence: {confidence}%</p>
                <div style={{ width: '100%', backgroundColor: '#4B5563', borderRadius: '9999px', height: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ width: `${confidence}%`, height: '0.5rem', borderRadius: '9999px', backgroundColor: prediction === 'buy' ? '#10B981' : '#EF4444' }} />
                </div>
              </div>
            )}
          </div>

          {/* Trade History */}
          <div style={{ backgroundColor: '#1F2937', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>📜 Trade History</h2>
            {tradeHistory.length === 0 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem 0' }}>No trades yet</p>
            ) : (
              <div style={{ maxHeight: '24rem', overflowY: 'auto' }}>
                {tradeHistory.map((trade) => (
                  <div key={trade.id} style={{ padding: '0.75rem', backgroundColor: '#374151', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>{trade.symbol}</span>
                      <span style={{ color: trade.type === 'BUY' ? '#10B981' : '#EF4444' }}>{trade.type}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ color: '#9CA3AF' }}>{trade.amount}</span>
                      <span style={{ color: '#6B7280' }}>{trade.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trading Card */}
        <div style={{ backgroundColor: '#1F2937', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1.5rem', border: '1px solid #374151' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>💰 Execute Trade</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ width: '100%', backgroundColor: '#374151', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'white', border: '1px solid #4B5563' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button onClick={() => executeTrade('buy')} style={{ backgroundColor: '#059669', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: '600', color: 'white', cursor: 'pointer' }}>📈 BUY</button>
            <button onClick={() => executeTrade('sell')} style={{ backgroundColor: '#DC2626', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: '600', color: 'white', cursor: 'pointer' }}>📉 SELL</button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {[100, 500, 1000].map((preset) => (
              <button key={preset} onClick={() => setAmount(preset.toString())} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#374151', border: 'none', borderRadius: '0.25rem', color: 'white', cursor: 'pointer' }}>${preset}</button>
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { name: 'BTC', price: '$43,250', change: '+2.4%' },
            { name: 'ETH', price: '$2,280', change: '+1.8%' },
            { name: 'SOL', price: '$98.50', change: '-0.5%' },
            { name: 'DOGE', price: '$0.082', change: '+5.2%' },
          ].map((crypto) => (
            <div key={crypto.name} style={{ backgroundColor: '#1F2937', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontWeight: '600' }}>{crypto.name}</p>
              <p style={{ fontSize: '0.875rem' }}>{crypto.price}</p>
              <p style={{ fontSize: '0.75rem', color: crypto.change.startsWith('+') ? '#10B981' : '#EF4444' }}>{crypto.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}