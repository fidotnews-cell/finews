'use client'

import { getArticles, Article, getSiteSettings, SiteSettings } from '@/app/actions'
import { ArticleFeed } from '@/components/ArticleFeed'
import { ArticleDetail } from '@/components/ArticleDetail'
import { MarketSidebar } from '@/components/MarketSidebar'
import { MobileMarketBar } from '@/components/MobileMarketBar'
import { RightSidebar } from '@/components/RightSidebar'
import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/MobileHeader'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { MobileMenu } from '@/components/MobileMenu'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { t } = useLanguage()
  
  // Simple check for hydration
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const isDesktop = useMediaQuery({ minWidth: 768 })

  useEffect(() => {
    getArticles(null).then((fetchedArticles) => {
      setArticles(fetchedArticles)
    })
    getSiteSettings().then(setSettings)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0d0f12] flex-col md:flex-row">
      
      {/* Mobile Header (Visible only on mobile when no article is selected) */}
      <div className="md:hidden">
          {!selectedArticle && (
            <>
              <MobileHeader onMenuClick={() => setShowMobileMenu(true)} />
              <MobileMarketBar />
            </>
          )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
            
            {/* Left Column: News List */}
            {/* On mobile: visible if no article selected. On desktop: always visible (fixed width) */}
            <main className={`
                flex-col bg-white dark:bg-[#0d0f12] overflow-y-auto
                ${selectedArticle ? 'hidden md:flex' : 'flex'}
                md:w-[50%] md:flex-shrink-0 md:border-r md:border-gray-200 md:dark:border-[#222] w-full
            `}>
                
                {/* Desktop Top Header (Hidden on Mobile) */}
                <header className="h-12 border-b border-gray-200 dark:border-[#222] hidden md:flex items-center px-4 justify-between bg-white dark:bg-[#15191c] sticky top-0 z-10 shrink-0">
                <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#777]">
                    <span className="cursor-pointer hover:text-black dark:hover:text-white text-black dark:text-white">All News</span>
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" placeholder={t('search.placeholder')} className="bg-gray-100 dark:bg-[#0b0f12] border-none rounded px-2 py-1 text-xs w-24 focus:w-32 transition-all outline-none text-black dark:text-gray-300" />
                </div>
                </header>

                {/* Orange Alert Banner */}
                {settings?.topNotification?.active && (
                  <div className="bg-[#ff9f43]/10 border-b border-[#ff9f43]/20 p-3 flex items-start gap-2 relative">
                    <span className="text-orange-500 text-xs">📢</span>
                    <p className="text-[10px] text-orange-400 leading-snug pr-4">
                      {settings.topNotification.text || '建议使用 VPN 服务商，最高节省 10 倍价格。等边际放宽的情境下，你将更容易获得收益。'}
                    </p>
                    <button className="absolute top-2 right-2 text-orange-500 hover:text-orange-300">×</button>
                  </div>
                )}

                {/* AI Banner */}
                {settings?.aiNotification?.active && (
                  <div className="bg-white dark:bg-[#1a1d23] border-b border-gray-200 dark:border-[#222] p-3 flex items-start gap-2 relative">
                    <span className="text-purple-500 text-xs">🤖</span>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug pr-4">
                      <span className="text-purple-500 dark:text-purple-400 font-bold">AI 提示:</span> {settings.aiNotification.text || '使用你内置的策略模块来构建港股/美股/币圈组合，自动化追踪，自动止盈止损。'}
                    </p>
                    <button className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">×</button>
                  </div>
                )}

                <ArticleFeed 
                    initialArticles={articles} 
                    onArticleSelect={setSelectedArticle} 
                    selectedArticleId={selectedArticle?._id}
                />
            </main>

            {/* Center Column: Detail Panel */}
            {/* On mobile: full screen absolute overlay if article selected. On desktop: flex-1 */}
            <div className={`
                bg-white dark:bg-[#0d0f12]
                ${selectedArticle ? 'absolute inset-0 z-20 flex flex-col md:static md:w-[50%]' : 'hidden md:block md:w-[50%]'}
                md:min-w-0 md:relative md:border-r md:border-gray-200 md:dark:border-[#222]
            `}>
                {selectedArticle ? (
                    <ArticleDetail 
                        article={selectedArticle} 
                        onClose={() => setSelectedArticle(null)}
                    />
                ) : (
                    <RightSidebar onArticleSelect={setSelectedArticle} />
                )}
            </div>
        </div>
        
        {/* Footer for News & Detail columns (Hidden on Mobile, or show in Menu?) */}
        <div className="hidden md:block">
            <Footer />
        </div>
      </div>

      {/* Right Column: Market Sidebar (Desktop Only) */}
      <div className="hidden xl:block">
        <MarketSidebar />
      </div>

      {/* Mobile Bottom Nav */}

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onMenuClick={() => setShowMobileMenu(true)} />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} />}
    </div>
  )
}
