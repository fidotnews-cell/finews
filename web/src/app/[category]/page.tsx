'use client'

import { getArticles, Article } from '@/app/actions'
import { ArticleFeed } from '@/components/ArticleFeed'
import { ArticleDetail } from '@/components/ArticleDetail'
import { RightSidebar } from '@/components/RightSidebar'
import { MarketSidebar } from '@/components/MarketSidebar'
import { MobileMarketBar } from '@/components/MobileMarketBar'
import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/MobileHeader'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { MobileMenu } from '@/components/MobileMenu'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState, use } from 'react'

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    getArticles(null, category).then(setArticles)
    setSelectedArticle(null) // Reset selected article when category changes
  }, [category])

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0d0f12] flex-col md:flex-row">
      
      {/* Mobile Header */}
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
            <main className={`
                flex-col bg-white dark:bg-[#0d0f12] overflow-y-auto
                ${selectedArticle ? 'hidden md:flex' : 'flex'}
                md:w-[50%] md:flex-shrink-0 md:border-r md:border-gray-200 md:dark:border-[#222] w-full
            `}>
                {/* Header */}
                <header className="h-12 border-b border-gray-200 dark:border-[#222] hidden md:flex items-center px-4 justify-between bg-white dark:bg-[#15191c] sticky top-0 z-10 shrink-0">
                   <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#777]">
                     <span className="text-black dark:text-white capitalize">{category} News</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="text" placeholder={t('search.placeholder')} className="bg-gray-100 dark:bg-[#0b0f12] border-none rounded px-2 py-1 text-xs w-32 focus:w-48 transition-all outline-none text-black dark:text-gray-300" />
                   </div>
                </header>

                <ArticleFeed 
                    initialArticles={articles} 
                    category={category}
                    onArticleSelect={setSelectedArticle} 
                    selectedArticleId={selectedArticle?._id}
                />
            </main>

            {/* Center Column: Detail Panel */}
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

        {/* Footer */}
        <div className="hidden md:block">
            <Footer />
        </div>
      </div>

      {/* Right Column: Market Sidebar */}
      <div className="hidden xl:block">
        <MarketSidebar />
      </div>

      {/* Mobile Nav/Menu */}
      <MobileBottomNav onMenuClick={() => setShowMobileMenu(true)} />
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} />}
    </div>
  )
}
