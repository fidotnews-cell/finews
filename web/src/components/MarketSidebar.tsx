'use client'

import { useLanguage } from './LanguageProvider'
import { useState } from 'react'
import { Briefcase, Settings } from 'lucide-react'
import { useArticleInteractions } from '@/context/ArticleInteractionContext'

interface MarketItem {
  symbol: string
  price: string
  change: number
  isHighlighted?: boolean
}

// Crypto Mock Data
const CRYPTO_DATA_1H: MarketItem[] = [
  { symbol: 'BTC', price: '$87,637', change: -0.24 },
  { symbol: 'ETH', price: '$2,960.8', change: 0.56 },
  { symbol: 'SOL', price: '$125.52', change: 0.43 },
  { symbol: 'BNB', price: '$852.87', change: 0.06 },
  { symbol: 'XRP', price: '$1.87', change: 0.14 },
  { symbol: 'DOGE', price: '$0.125', change: 0.98 },
  { symbol: 'USDT', price: '$0.999', change: -0.05 },
  { symbol: 'USDC', price: '$0.999', change: -0.08 },
  { symbol: 'TRX', price: '$0.282', change: -0.61 },
]

const CRYPTO_DATA_24H: MarketItem[] = [
  { symbol: 'BTC', price: '$88,200', change: 2.5 },
  { symbol: 'ETH', price: '$3,050', change: 4.2 },
  { symbol: 'SOL', price: '$130.10', change: 3.5 },
  { symbol: 'BNB', price: '$860.50', change: 1.8 },
  { symbol: 'XRP', price: '$1.95', change: 5.5 },
  { symbol: 'DOGE', price: '$0.14', change: 12.5 },
  { symbol: 'USDT', price: '$1.00', change: 0.01 },
  { symbol: 'USDC', price: '$1.00', change: 0.02 },
  { symbol: 'TRX', price: '$0.29', change: 1.2 },
]

const CRYPTO_DATA_7D: MarketItem[] = [
  { symbol: 'BTC', price: '$85,000', change: -8.2 },
  { symbol: 'ETH', price: '$2,800', change: -4.5 },
  { symbol: 'SOL', price: '$118.20', change: -6.5 },
  { symbol: 'BNB', price: '$820.10', change: -3.2 },
  { symbol: 'XRP', price: '$1.75', change: -8.5 },
  { symbol: 'DOGE', price: '$0.11', change: -15.2 },
  { symbol: 'USDT', price: '$0.998', change: -0.1 },
  { symbol: 'USDC', price: '$0.998', change: -0.1 },
  { symbol: 'TRX', price: '$0.27', change: -4.2 },
]

// Stock Mock Data
const STOCK_DATA_1H: MarketItem[] = [
  { symbol: 'SPX', price: '5,205.10', change: 0.15 },
  { symbol: 'NDX', price: '18,150.20', change: 0.32 },
  { symbol: 'DJI', price: '39,450.00', change: -0.12 },
  { symbol: 'NVDA', price: '885.50', change: 1.5 },
  { symbol: 'AAPL', price: '170.20', change: 0.1 },
  { symbol: 'TSLA', price: '174.80', change: -0.5 },
  { symbol: 'MSFT', price: '420.50', change: 0.8 },
  { symbol: 'GOOGL', price: '175.00', change: 0.4 },
]

const STOCK_DATA_24H: MarketItem[] = [
  { symbol: 'SPX', price: '5,250.00', change: 1.2 },
  { symbol: 'NDX', price: '18,300.00', change: 1.8 },
  { symbol: 'DJI', price: '39,800.00', change: 0.8 },
  { symbol: 'NVDA', price: '900.00', change: 4.5 },
  { symbol: 'AAPL', price: '172.50', change: 1.2 },
  { symbol: 'TSLA', price: '180.00', change: 2.5 },
  { symbol: 'MSFT', price: '425.00', change: 1.5 },
  { symbol: 'GOOGL', price: '178.00', change: 1.2 },
]

const STOCK_DATA_7D: MarketItem[] = [
  { symbol: 'SPX', price: '5,100.00', change: -1.5 },
  { symbol: 'NDX', price: '17,900.00', change: -2.1 },
  { symbol: 'DJI', price: '39,000.00', change: -0.5 },
  { symbol: 'NVDA', price: '850.00', change: -3.2 },
  { symbol: 'AAPL', price: '168.00', change: -1.5 },
  { symbol: 'TSLA', price: '165.00', change: -5.5 },
  { symbol: 'MSFT', price: '415.00', change: -1.2 },
  { symbol: 'GOOGL', price: '170.00', change: -2.5 },
]

export function MarketSidebar() {
  const { t } = useLanguage()
  const { isAdminMode, toggleAdminMode } = useArticleInteractions()
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('1h')

  const cryptoData = timeframe === '1h' ? CRYPTO_DATA_1H : timeframe === '24h' ? CRYPTO_DATA_24H : CRYPTO_DATA_7D
  const stockData = timeframe === '1h' ? STOCK_DATA_1H : timeframe === '24h' ? STOCK_DATA_24H : STOCK_DATA_7D

  return (
    <aside className="w-[200px] bg-white dark:bg-[#0b0f12] flex-shrink-0 hidden xl:flex flex-col h-full border-l border-gray-200 dark:border-[#222] overflow-hidden">
      
      {/* Header Tabs */}
      <div className="flex items-center px-2 py-2 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#15191c] shrink-0">
         <Briefcase className="w-4 h-4 text-orange-500 mr-2" />
         <div className="flex bg-white dark:bg-[#0b0f12] rounded p-0.5 flex-1 border border-gray-200 dark:border-transparent">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 text-[10px] font-medium py-1 rounded transition-colors ${
                  timeframe === tf 
                    ? 'bg-gray-100 dark:bg-[#222] text-black dark:text-white' 
                    : 'text-gray-500 hover:text-black dark:hover:text-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
         </div>
      </div>

      {/* Portfolio Value (Mock) */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#0b0f12] flex justify-between items-end shrink-0">
         <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Portfolio</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">$0.00</div>
         </div>
         <div className="flex items-center gap-2">
             <button 
                 onClick={toggleAdminMode}
                 className={`p-1.5 rounded transition-colors ${isAdminMode ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'}`}
                 title="Admin Mode"
             >
                 <Settings className="w-3 h-3" />
             </button>
             <div className="text-[10px] text-gray-500 dark:text-gray-600 mb-0.5">%</div>
         </div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#222] scrollbar-track-transparent">
        
        {/* Crypto Section */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#0b0f12]/95 backdrop-blur px-3 py-1.5 border-b border-gray-200 dark:border-[#222] z-10">
           <span className="text-[10px] font-bold text-gray-500 dark:text-[#555] uppercase">Crypto</span>
        </div>
        <div>
            {cryptoData.map((item) => (
            <div 
                key={item.symbol} 
                className={`flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-[#1a1e21] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1e23] transition-colors ${
                item.isHighlighted ? 'bg-blue-50 dark:bg-[#0e1525]' : ''
                }`}
            >
                <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 w-12">{item.symbol}</div>
                <div className="text-[11px] font-medium text-gray-600 dark:text-gray-200 flex-1 text-right mr-3">{item.price}</div>
                <div className={`text-[10px] font-medium w-10 text-right ${item.change >= 0 ? 'text-green-600 dark:text-[#28C76F]' : 'text-red-600 dark:text-[#EA4E4E]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
            </div>
            ))}
        </div>

        {/* Stock Section */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#0b0f12]/95 backdrop-blur px-3 py-1.5 border-b border-gray-200 dark:border-[#222] z-10 border-t mt-2">
           <span className="text-[10px] font-bold text-gray-500 dark:text-[#555] uppercase">Stocks</span>
        </div>
        <div>
            {stockData.map((item) => (
            <div 
                key={item.symbol} 
                className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-[#1a1e21] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1e23] transition-colors"
            >
                <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 w-12">{item.symbol}</div>
                <div className="text-[11px] font-medium text-gray-600 dark:text-gray-200 flex-1 text-right mr-3">{item.price}</div>
                <div className={`text-[10px] font-medium w-10 text-right ${item.change >= 0 ? 'text-green-600 dark:text-[#28C76F]' : 'text-red-600 dark:text-[#EA4E4E]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
            </div>
            ))}
        </div>

      </div>
    </aside>
  )
}
