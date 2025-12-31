'use client'

import { Rss, Flame, Menu } from 'lucide-react'

interface MobileBottomNavProps {
  onMenuClick: () => void
  activeTab?: string
}

export function MobileBottomNav({ onMenuClick, activeTab = 'news' }: MobileBottomNavProps) {
  return (
    <div className="h-16 bg-[#0d0f12] border-t border-[#222] flex items-center justify-around px-4 shrink-0 md:hidden z-50 sticky bottom-0 w-full">
      <button 
        onClick={() => window.location.href = '/'}
        className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${activeTab === 'news' ? 'text-white' : 'text-gray-500'}`}
      >
        <Rss className="w-5 h-5" />
        <span className="text-[10px] font-medium">News</span>
      </button>
      
      <button 
        onClick={() => {
          // Scroll to hot section or navigate to hot news page if exists
          // Since "Hot News" is now at the bottom of article detail, or potentially a category
          // Let's scroll to top for now or refresh to home which shows news
          // Or maybe we should implement a Hot News filter?
          // For now, let's redirect to home with a query param or hash?
          // Or if we are on home, scroll to top.
          window.location.href = '/?filter=hot'
        }}
        className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500"
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-medium">Hot</span>
      </button>

      {/* Placeholder to balance the layout if needed, or just keep 2 main items + Menu */}
      
      <button onClick={onMenuClick} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500">
        <Menu className="w-6 h-6 text-white" />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  )
}
