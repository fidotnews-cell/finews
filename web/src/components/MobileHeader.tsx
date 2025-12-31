'use client'

import { Search, Menu, ChevronDown, Check, ChevronRight, Moon, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { getSiteSettings, SiteSettings } from '@/app/actions'
import { urlFor } from '@/lib/sanity'

import { usePathname } from 'next/navigation'

const CATEGORIES = [
  { id: 'top_news', label: 'All News' },
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
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  
  // Find current category based on pathname
  const getCurrentCategory = () => {
    // If pathname is root or undefined, default to first category (All News)
    if (!pathname || pathname === '/') return CATEGORIES[0]
    
    // Remove leading slash
    const path = pathname.slice(1)
    
    // Check main categories
    const mainCat = CATEGORIES.find(c => c.id === path)
    if (mainCat) return mainCat
    
    // Check subcategories
    for (const cat of CATEGORIES) {
      if (cat.subCategories) {
        const sub = cat.subCategories.find(s => s.id === path)
        if (sub) {
          // Return a constructed object that includes parent context if needed, 
          // or just the subcategory with modified label
          return { ...sub, label: `${cat.label} - ${sub.label}` }
        }
      }
    }
    
    // Fallback to All News if not found (e.g. article detail page)
    return CATEGORIES[0]
  }

  const [selectedCategory, setSelectedCategory] = useState(getCurrentCategory())
  
  // Update selected category when pathname changes
  useEffect(() => {
    setSelectedCategory(getCurrentCategory())
  }, [pathname])

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
           <div onClick={() => window.location.href = '/'} className="cursor-pointer">
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
           </div>
           
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
                                        // If no subcategories, navigate immediately
                                        if (!cat.subCategories) {
                                            window.location.href = cat.id === 'top_news' ? '/' : `/${cat.id}`
                                            setSelectedCategory(cat)
                                            setIsDropdownOpen(false)
                                        } else {
                                            // Toggle expand
                                            setExpandedCategories(prev => 
                                                prev.includes(cat.id) 
                                                  ? prev.filter(id => id !== cat.id)
                                                  : [...prev, cat.id]
                                            )
                                        }
                                    }}
                                >
                                    <span>{cat.label}</span>
                                    <div className="flex items-center gap-2">
                                        {cat.subCategories && (
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation() // Prevent parent click
                                                    toggleExpand(e, cat.id)
                                                }}
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
                                            <Link
                                                key={sub.id}
                                                href={`/${sub.id}`} // Assuming category pages exist
                                                onClick={() => {
                                                    setSelectedCategory({ ...sub, label: `${cat.label} - ${sub.label}` })
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="w-full text-left px-8 py-2 text-xs text-gray-400 hover:bg-[#222] hover:text-white flex items-center justify-between block"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  )}
              </div>
              {/* Show All button removed */}
           </div>
        </div>

        <div className="flex items-center gap-4">
           {mounted && (
             <button onClick={toggleTheme} className="text-gray-300 hover:text-white">
                <Moon className="w-5 h-5" />
             </button>
           )}
           <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white">
              <Search className="w-5 h-5" />
           </button>
           {/* Bell icon removed */}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#15191c]/90 w-full max-w-sm rounded-xl p-4 shadow-2xl border border-[#333] relative">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute -top-12 right-0 text-white p-2 bg-[#222] rounded-full hover:bg-[#333] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  className="w-full bg-[#0d0f12] text-white pl-9 pr-4 py-3 rounded-lg border border-[#333] focus:border-blue-500 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       // Trigger search
                       console.log('Searching for:', searchQuery)
                       setIsSearchOpen(false)
                    }
                  }}
                  autoFocus
                />
              </div>
              <button 
                onClick={() => {
                   console.log('Searching for:', searchQuery)
                   setIsSearchOpen(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {/* Search Suggestions */}
            <div className="mt-4">
               <p className="text-xs text-gray-500 uppercase font-bold mb-2">Popular</p>
               <div className="flex flex-wrap gap-2">
                  {['Bitcoin', 'Ethereum', 'AI', 'DeFi'].map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => {
                        setSearchQuery(tag)
                        // Optional: Auto search on click?
                        // console.log('Searching for:', tag)
                        // setIsSearchOpen(false)
                      }}
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded text-xs text-gray-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
