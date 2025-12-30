'use client'

import { useState } from 'react'
import { Briefcase, X, ChevronDown, Bell, MessageSquare, LogIn, UserPlus, Facebook, Twitter, Send, Github, AppWindow, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'

interface MarketItem {
  symbol: string
  price: string
  change: number
  isHighlighted?: boolean
}

// Reuse data (in a real app, this would be a shared hook or context)
const CRYPTO_DATA_1H: MarketItem[] = [
  { symbol: 'BTC', price: '$87,637', change: -0.24 },
  { symbol: 'ETH', price: '$2,960.8', change: 0.56 },
  { symbol: 'SOL', price: '$125.52', change: 0.43 },
  { symbol: 'BNB', price: '$852.87', change: 0.06 },
  { symbol: 'XRP', price: '$1.87', change: 0.14 },
  { symbol: 'DOGE', price: '$0.125', change: 0.98 },
  { symbol: 'USDT', price: '$0.999', change: -0.05 },
]

const CRYPTO_DATA_24H: MarketItem[] = [
  { symbol: 'BTC', price: '$88,200', change: 2.5 },
  { symbol: 'ETH', price: '$3,050', change: 4.2 },
  { symbol: 'SOL', price: '$130.10', change: 3.5 },
  { symbol: 'BNB', price: '$860.50', change: 1.8 },
  { symbol: 'XRP', price: '$1.95', change: 5.5 },
  { symbol: 'DOGE', price: '$0.14', change: 12.5 },
  { symbol: 'USDT', price: '$1.00', change: 0.01 },
]

const CRYPTO_DATA_7D: MarketItem[] = [
  { symbol: 'BTC', price: '$85,000', change: -8.2 },
  { symbol: 'ETH', price: '$2,800', change: -4.5 },
  { symbol: 'SOL', price: '$118.20', change: -6.5 },
  { symbol: 'BNB', price: '$820.10', change: -3.2 },
  { symbol: 'XRP', price: '$1.75', change: -8.5 },
  { symbol: 'DOGE', price: '$0.11', change: -15.2 },
  { symbol: 'USDT', price: '$0.998', change: -0.1 },
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

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage()
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('1h')
  
  const cryptoData = timeframe === '1h' ? CRYPTO_DATA_1H : timeframe === '24h' ? CRYPTO_DATA_24H : CRYPTO_DATA_7D
  const stockData = timeframe === '1h' ? STOCK_DATA_1H : timeframe === '24h' ? STOCK_DATA_24H : STOCK_DATA_7D

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Menu Panel */}
      <div className="relative w-4/5 max-w-sm bg-[#0d0f12] h-full flex flex-col shadow-2xl border-l border-[#222]">
        
        {/* Header Tabs */}
        <div className="flex items-center px-2 py-2 border-b border-[#222] bg-[#15191c] shrink-0">
           <Briefcase className="w-4 h-4 text-orange-500 mr-2" />
           <div className="flex bg-[#0b0f12] rounded p-0.5 flex-1">
              {(['1h', '24h', '7d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`flex-1 text-[10px] font-medium py-1 rounded transition-colors ${
                    timeframe === tf 
                      ? 'bg-[#222] text-white' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
           </div>
           <button onClick={onClose} className="ml-2 p-1 text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto border-b border-[#222]">
           
           {/* Crypto Section */}
           <div className="sticky top-0 bg-[#15191c] px-4 py-1.5 border-b border-[#222] z-10">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Crypto</span>
           </div>
           {cryptoData.map((item) => (
            <div 
                key={item.symbol} 
                className="flex items-center justify-between px-4 py-3 border-b border-[#1a1e21]"
            >
                <div className="text-xs font-bold text-gray-300 w-12">{item.symbol}</div>
                <div className="text-xs font-medium text-gray-200 flex-1 text-right mr-3">{item.price}</div>
                <div className={`text-xs font-medium w-12 text-right ${item.change >= 0 ? 'text-[#28C76F]' : 'text-[#EA4E4E]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
            </div>
            ))}

           {/* Stock Section */}
           <div className="sticky top-0 bg-[#15191c] px-4 py-1.5 border-b border-[#222] z-10 border-t">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Stocks</span>
           </div>
           {stockData.map((item) => (
            <div 
                key={item.symbol} 
                className="flex items-center justify-between px-4 py-3 border-b border-[#1a1e21]"
            >
                <div className="text-xs font-bold text-gray-300 w-12">{item.symbol}</div>
                <div className="text-xs font-medium text-gray-200 flex-1 text-right mr-3">{item.price}</div>
                <div className={`text-xs font-medium w-12 text-right ${item.change >= 0 ? 'text-[#28C76F]' : 'text-[#EA4E4E]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
            </div>
            ))}

           <div className="p-3 text-center text-xs text-gray-600">
             Use search to follow more currencies
           </div>
        </div>

        {/* Menu Links */}
        <div className="bg-[#15191c] overflow-y-auto">
            <MenuLink label="SUBMIT SOURCE" href="/submit-source" />
            <MenuLink label="ADVERTISE" href="/advertise" />
            <MenuLink label="DEVELOPERS" href="/developers" />
            <MenuLink label="ABOUT" href="/about" />
            <MenuLink label="CONTACT" href="/contact" />
            <MenuLink label="TERMS" href="/terms" />
            
            <div className="flex items-center justify-between p-4 border-t border-[#222]">
               <div className="flex items-center gap-4 text-gray-400">
                 <Facebook className="w-4 h-4" />
                 <Twitter className="w-4 h-4" />
                 <Send className="w-4 h-4" />
                 <Github className="w-4 h-4" />
                 <AppWindow className="w-4 h-4" />
                 <Smartphone className="w-4 h-4" />
               </div>
            </div>
        </div>

      </div>
    </div>
  )
}

function MenuLink({ label, href }: { label: string, href: string }) {
  return (
    <Link href={href} className="block px-4 py-3 border-b border-[#222] text-sm font-medium text-gray-300 hover:bg-[#1e2327] hover:text-white transition-colors uppercase tracking-wider">
       {label}
    </Link>
  )
}
