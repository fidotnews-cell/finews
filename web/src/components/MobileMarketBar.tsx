'use client'

import { useState, useEffect } from 'react'

interface MarketItem {
  symbol: string
  price: string
  change: number
}

// Extended Mock Data to simulate "Top 20"
const CRYPTO_DATA: MarketItem[] = [
  { symbol: 'BTC', price: '$88,200', change: 2.5 },
  { symbol: 'ETH', price: '$3,050', change: 4.2 },
  { symbol: 'SOL', price: '$130.10', change: 3.5 },
  { symbol: 'BNB', price: '$860.50', change: 1.8 },
  { symbol: 'XRP', price: '$1.95', change: 5.5 },
  { symbol: 'DOGE', price: '$0.14', change: 12.5 },
  { symbol: 'USDT', price: '$1.00', change: 0.01 },
  { symbol: 'USDC', price: '$1.00', change: 0.02 },
  { symbol: 'TRX', price: '$0.29', change: 1.2 },
  { symbol: 'ADA', price: '$0.45', change: -1.2 },
  { symbol: 'AVAX', price: '$35.20', change: 2.1 },
  { symbol: 'DOT', price: '$7.50', change: 0.5 },
  { symbol: 'LINK', price: '$14.20', change: 3.8 },
  { symbol: 'MATIC', price: '$0.72', change: -0.5 },
  { symbol: 'SHIB', price: '$0.000025', change: 8.5 },
  { symbol: 'LTC', price: '$82.50', change: 1.1 },
  { symbol: 'BCH', price: '$450.00', change: 0.9 },
  { symbol: 'UNI', price: '$10.50', change: 4.5 },
  { symbol: 'ATOM', price: '$8.80', change: -1.5 },
  { symbol: 'XLM', price: '$0.11', change: 0.2 },
]

const STOCK_DATA: MarketItem[] = [
  { symbol: 'SPX', price: '5,250.00', change: 1.2 },
  { symbol: 'NDX', price: '18,300.00', change: 1.8 },
  { symbol: 'DJI', price: '39,800.00', change: 0.8 },
  { symbol: 'NVDA', price: '900.00', change: 4.5 },
  { symbol: 'AAPL', price: '172.50', change: 1.2 },
  { symbol: 'TSLA', price: '180.00', change: 2.5 },
  { symbol: 'MSFT', price: '425.00', change: 1.5 },
  { symbol: 'GOOGL', price: '178.00', change: 1.2 },
  { symbol: 'AMZN', price: '185.00', change: 1.1 },
  { symbol: 'META', price: '495.00', change: 2.2 },
  { symbol: 'AMD', price: '170.00', change: 3.5 },
  { symbol: 'NFLX', price: '620.00', change: 0.5 },
  { symbol: 'INTC', price: '35.00', change: -2.1 },
  { symbol: 'IBM', price: '190.00', change: 0.8 },
  { symbol: 'ORCL', price: '125.00', change: 1.5 },
  { symbol: 'CRM', price: '300.00', change: 0.9 },
  { symbol: 'ADBE', price: '480.00', change: -0.5 },
  { symbol: 'PYPL', price: '65.00', change: 1.2 },
  { symbol: 'SQ', price: '75.00', change: 2.8 },
  { symbol: 'COIN', price: '250.00', change: 5.5 },
]

export function MobileMarketBar() {
  const [activeTab, setActiveTab] = useState<'crypto' | 'stock'>('crypto')

  const data = activeTab === 'crypto' ? CRYPTO_DATA : STOCK_DATA

  return (
    <div className="flex flex-col border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#0d0f12]">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-[#222]">
        <button 
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider ${activeTab === 'crypto' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Crypto (Top 20)
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider ${activeTab === 'stock' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Stocks (Top 20)
        </button>
      </div>

      {/* Horizontal Scroll List */}
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-2 flex items-center gap-3">
        {data.map((item) => (
          <div 
            key={item.symbol} 
            className="inline-flex flex-col items-start justify-center min-w-[80px] px-2 py-1 rounded bg-gray-50 dark:bg-[#15191c] border border-gray-100 dark:border-[#222]"
          >
             <div className="flex items-center justify-between w-full gap-2">
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.symbol}</span>
                <span className={`text-[10px] font-medium ${item.change >= 0 ? 'text-green-600 dark:text-[#28C76F]' : 'text-red-600 dark:text-[#EA4E4E]'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </span>
             </div>
             <div className="text-[11px] font-medium text-gray-900 dark:text-white mt-0.5">
               {item.price}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
