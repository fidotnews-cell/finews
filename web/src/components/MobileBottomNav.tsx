'use client'

import { Rss, Flame, Menu } from 'lucide-react'

interface MobileBottomNavProps {
  onMenuClick: () => void
  activeTab?: string
}

export function MobileBottomNav({ onMenuClick, activeTab = 'news' }: MobileBottomNavProps) {
  return (
    <div className="h-16 bg-[#0d0f12] border-t border-[#222] flex items-center justify-around px-4 shrink-0 md:hidden z-50">
      <button className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${activeTab === 'news' ? 'text-white' : 'text-gray-500'}`}>
        <Rss className="w-5 h-5" />
        <span className="text-[10px] font-medium">News</span>
      </button>
      
      <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500">
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
