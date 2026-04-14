'use client';

import { useState } from 'react';

export default function TradingPage() {
  // State management for trading data
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

  // Simulate AI prediction
  const getAIPrediction = () => {
    // Simulate AI analysis (random for demo)
    const randomPrediction = Math.random() > 0.5 ? 'buy' : 'sell';
    const randomConfidence = Math.floor(Math.random() * 30) + 60; // 60-90%
    
    setPrediction(randomPrediction);
    setConfidence(randomConfidence);
  };

  // Execute trade
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          🤖 AI Trading Assistant
        </h1>
        <p className="text-gray-400 mt-2">Powered by Machine Learning</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Trading Controls */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Prediction Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">🧠 AI Market Analysis</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Trading Pair</label>
                <select 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600"
                >
                  <option>BTC/USD</option>
                  <option>ETH/USD</option>
                  <option>SOL/USD</option>
                  <option>DOGE/USD</option>
                </select>
              </div>

              <button
                onClick={getAIPrediction}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold transition"
              >
                🔮 Get AI Prediction
              </button>

              {/* Display Prediction */}
              {prediction && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">AI Recommendation:</p>
                  <p className={`text-2xl font-bold ${prediction === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {prediction.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Confidence: {confidence}%
                  </p>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${prediction === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trading Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">💰 Execute Trade</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => executeTrade('buy')}
                  className="bg-green-600 hover:bg-green-700 rounded-lg py-3 font-semibold transition"
                >
                  📈 BUY
                </button>
                <button
                  onClick={() => executeTrade('sell')}
                  className="bg-red-600 hover:bg-red-700 rounded-lg py-3 font-semibold transition"
                >
                  📉 SELL
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                {[100, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Trade History */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📜 Trade History</h2>
            
            {tradeHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No trades yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tradeHistory.map((trade) => (
                  <div key={trade.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{trade.symbol}</span>
                      <span className={`text-sm ${trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">{trade.amount}</span>
                      <span className="text-gray-500">{trade.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { name: 'BTC', price: '$43,250', change: '+2.4%' },
            { name: 'ETH', price: '$2,280', change: '+1.8%' },
            { name: 'SOL', price: '$98.50', change: '-0.5%' },
            { name: 'DOGE', price: '$0.082', change: '+5.2%' },
          ].map((crypto) => (
            <div key={crypto.name} className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="font-semibold">{crypto.name}</p>
              <p className="text-sm">{crypto.price}</p>
              <p className={`text-xs ${crypto.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}