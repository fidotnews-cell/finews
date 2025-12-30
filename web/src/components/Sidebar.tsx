'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/components/LanguageProvider'
import { getSiteSettings, SiteSettings } from '@/app/actions'
import { urlFor } from '@/lib/sanity'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const { t } = useLanguage()
  
  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  const navItems = [
    { name: t('nav.top_news'), path: '/' },
    { name: t('nav.crypto'), path: '/crypto' },
    { name: t('nav.web3'), path: '/web3' },
    { name: t('nav.ai'), path: '/ai' },
    { name: t('nav.domain'), path: '/domain' },
    { name: t('nav.markets'), path: '/markets' },
    { name: t('nav.macro'), path: '/macro' },
    { name: t('nav.capital'), path: '/capital' },
    { name: t('nav.companies'), path: '/companies' },
    { name: t('nav.regulation'), path: '/regulation' },
    { name: t('nav.data'), path: '/data' },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-[#0d0f12] border-r border-gray-200 dark:border-[#222] flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-4 flex items-center gap-2 border-b border-gray-100 dark:border-[#222]">
         {settings?.logo ? (
           <img 
             src={urlFor(settings.logo).width(64).url()} 
             alt={settings.title || 'Fi.News'} 
             className="w-8 h-8 rounded object-cover"
           />
         ) : (
           <div className="w-8 h-8 bg-orange-500 dark:bg-white rounded flex items-center justify-center text-white dark:text-black font-bold">Fi</div>
         )}
         <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
           {settings?.title || 'Fi.News'}
         </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className={`flex items-center px-3 py-2 rounded-md transition-colors font-medium text-sm ${
                  item.path === '/' // Simplified active state logic for demo
                  ? 'bg-gray-100 dark:bg-[#1e2327] text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2327] hover:text-black dark:hover:text-white'
              }`}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-100 dark:border-[#222] flex items-center justify-between gap-2">
         <div className="flex-1">
            <LanguageSwitcher />
         </div>
         <ThemeToggle />
      </div>
    </aside>
  )
}
