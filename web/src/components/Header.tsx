'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { useLanguage } from './LanguageProvider'
import { useArticleInteractions } from '@/context/ArticleInteractionContext'
import { Settings } from 'lucide-react'

export function Header() {
  const { t } = useLanguage()
  const { isAdminMode, toggleAdminMode } = useArticleInteractions()

  const categories = [
    { name: t('header.show_all'), path: '/' },
    { name: t('nav.ai'), path: '/ai' },
    { name: t('nav.crypto'), path: '/crypto' },
    { name: t('nav.web3'), path: '/web3' },
    { name: 'Finance', path: '/finance' },
    { name: 'Stock', path: '/stock' },
    { name: 'Gold', path: '/gold' },
    { name: 'VC', path: '/vc' },
  ]

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold dark:text-white">Fi.News</Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 overflow-x-auto">
            {categories.map((cat) => (
              <Link 
                key={cat.path} 
                href={cat.path}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          
          <ThemeToggle />

          <button 
            onClick={toggleAdminMode}
            className={`p-2 rounded-full transition-colors ${isAdminMode ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
            title="Toggle Admin Mode"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <div className="md:hidden">
            {/* Mobile menu trigger placeholder */}
            <button className="text-gray-500 dark:text-gray-400">Menu</button>
          </div>
        </div>
      </div>
    </header>
  )
}
