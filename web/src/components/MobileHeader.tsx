'use client'

import { Search, Bell, Menu, ChevronDown, Check, ChevronRight, Moon } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { getSiteSettings, SiteSettings } from '@/app/actions'
import { urlFor } from '@/lib/sanity'

const CATEGORIES = [
  { id: 'top_news', label: 'Top News' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'web3', label: 'Web3' },
  { id: 'ai', label: 'AI' },
  { 
    id: 'finance', 
    label: 'Finance',
    subCategories: [
      { id: 'markets', label: 'Markets' },
      { id: 'macro', label: 'Macro' },
      { id: 'capital', label: 'Capital' },
      { id: 'companies', label: 'Companies' },
      { id: 'regulation', label: 'Regulation' },
      { id: 'data', label: 'Data' },
    ]
  },
]

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    getSiteSettings().then(setSettings)
  }, [])

  const toggleExpand = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation()
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="bg-[#0d0f12] text-white flex flex-col md:hidden shrink-0 relative z-40">
      {/* Top Bar */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#222]">
        <div className="flex items-center gap-4">
           {/* Logo Icon */}
           {settings?.logo ? (
             <img 
               src={urlFor(settings.logo).width(64).url()} 
               alt={settings.title || 'Fi.News'} 
               className="w-8 h-8 rounded object-cover"
             />
           ) : (
             <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
               Fi
             </div>
           )}
           
           <div className="flex items-center gap-4">
              <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 text-sm font-bold"
                  >
                     {selectedCategory.label} <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#15191c] border border-[#333] rounded shadow-xl py-1 z-50 max-h-[80vh] overflow-y-auto">
                        {CATEGORIES.map(cat => (
                            <div key={cat.id}>
                                <div 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white flex items-center justify-between cursor-pointer"
                                    onClick={() => {
                                        setSelectedCategory(cat)
                                        setIsDropdownOpen(false)
                                    }}
                                >
                                    <span>{cat.label}</span>
                                    <div className="flex items-center gap-2">
                                        {cat.subCategories && (
                                            <div 
                                                onClick={(e) => toggleExpand(e, cat.id)}
                                                className="p-1 rounded text-gray-300 hover:text-white"
                                            >
                                                {expandedCategories.includes(cat.id) ? (
                                                    <ChevronDown className="w-3 h-3" />
                                                ) : (
                                                    <ChevronRight className="w-3 h-3" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Subcategories */}
                                {cat.subCategories && expandedCategories.includes(cat.id) && (
                                    <div className="bg-[#1a1e23] border-t border-[#222]">
                                        {cat.subCategories.map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => {
                                                    setSelectedCategory({ ...sub, label: `${cat.label} - ${sub.label}` }) // Or just sub.label
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="w-full text-left px-8 py-2 text-xs text-gray-400 hover:bg-[#222] hover:text-white flex items-center justify-between"
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  )}
              </div>
              <button className="flex items-center gap-1 text-sm text-gray-300">
                 Show All
              </button>
           </div>
        </div>

        <div className="flex items-center gap-4">
           {mounted && (
             <button onClick={toggleTheme} className="text-gray-300 hover:text-white">
                <Moon className="w-5 h-5" />
             </button>
           )}
           <Search className="w-5 h-5 text-gray-300" />
           <Bell className="w-5 h-5 text-gray-300" />
           <Menu className="w-6 h-6 text-white cursor-pointer" onClick={onMenuClick} />
        </div>
      </div>

      {/* Ticker */}
      <div className="h-8 bg-black flex items-center px-4 overflow-x-auto whitespace-nowrap scrollbar-hide gap-6 border-b border-[#222]">
         <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">BTC</span>
            <span className="text-white font-medium">$86,948</span>
            <span className="text-red-500">-0.96%</span>
         </div>
         <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">ETH</span>
            <span className="text-white font-medium">$2,918.8</span>
            <span className="text-red-500">-0.74%</span>
         </div>
         <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">USDT</span>
            <span className="text-white font-medium">$0.999</span>
            <span className="text-red-500">-0.01%</span>
         </div>
      </div>
    </div>
  )
}
