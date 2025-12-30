'use client'

import { Rss, Flame, Crown, Briefcase, BookOpen, Menu } from 'lucide-react'

interface MobileBottomNavProps {
  onMenuClick: () => void
  activeTab?: string
}

export function MobileBottomNav({ onMenuClick, activeTab = 'news' }: MobileBottomNavProps) {
  return (
    <div className="h-16 bg-[#0d0f12] border-t border-[#222] flex items-center justify-between px-2 shrink-0 md:hidden z-50">
      <button className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${activeTab === 'news' ? 'text-white' : 'text-gray-500'}`}>
        <Rss className="w-5 h-5" />
        <span className="text-[10px] font-medium">News</span>
      </button>
      
      <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500">
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-medium">Rising</span>
      </button>

      <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-yellow-500">
        <Crown className="w-5 h-5" />
        <span className="text-[10px] font-medium">Get PLUS</span>
      </button>

      <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500">
        <Briefcase className="w-5 h-5" />
        <span className="text-[10px] font-medium">Portfolio</span>
      </button>

      <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500">
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-medium">Guides</span>
      </button>

      <button onClick={onMenuClick} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-500 ml-auto border-l border-[#222]">
        <Menu className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}
