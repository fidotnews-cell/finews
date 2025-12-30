'use client'

import { getArticleBySlug, getRelatedArticles, getAdjacentArticles, translateArticle, Article } from '@/app/actions'
import { ArticleFeed } from '@/components/ArticleFeed'
import { RightSidebar } from '@/components/RightSidebar'
import { MarketSidebar } from '@/components/MarketSidebar'
import { PortableText } from '@portabletext/react'
import { notFound, useRouter } from 'next/navigation'
import { TimeAgo } from '@/components/TimeAgo'
import { useLanguage } from '@/components/LanguageProvider'
import { useEffect, useState, use } from 'react'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [translatedArticle, setTranslatedArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [adjacentArticles, setAdjacentArticles] = useState<{ prev: Article | null, next: Article | null }>({ prev: null, next: null })
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const { t, language } = useLanguage()
  const router = useRouter()

  // Initial fetch
  useEffect(() => {
    async function fetchData() {
      const fetchedArticle = await getArticleBySlug(slug)
      if (fetchedArticle) {
        setArticle(fetchedArticle)
        setTranslatedArticle(fetchedArticle)
        const [related, adjacent] = await Promise.all([
          getRelatedArticles(fetchedArticle._id),
          getAdjacentArticles(fetchedArticle._id, fetchedArticle.publishedAt)
        ])
        setRelatedArticles(related)
        setAdjacentArticles(adjacent)
      }
      setLoading(false)
    }
    fetchData()
  }, [slug])

  // Handle translation
  useEffect(() => {
    async function performTranslation() {
      if (!article) return
      
      if (language === 'en') {
        setTranslatedArticle(article)
        return
      }

      setTranslating(true)
      try {
        const translated = await translateArticle(article, language)
        setTranslatedArticle(translated)
      } catch (error) {
        console.error('Translation failed:', error)
      } finally {
        setTranslating(false)
      }
    }

    performTranslation()
  }, [language, article])

  if (loading) return null
  if (!article) notFound()

  // Use translated article for display, fallback to original
  const displayArticle = translatedArticle || article

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Column */}
      <main className="flex-1 min-w-0 border-r border-gray-200 dark:border-[#222] overflow-y-auto bg-white dark:bg-[#0b0f12]">
        
        {/* Top Header inside Feed (matching other pages) */}
        <header className="h-12 border-b border-gray-200 dark:border-[#222] flex items-center px-4 justify-between bg-white dark:bg-[#15191c] sticky top-0 z-10">
           <div className="flex gap-4 items-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#777]">
             <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
               <ArrowLeft className="w-4 h-4" />
               <span>Back</span>
             </button>
             <span className="text-gray-300 dark:text-[#333]">|</span>
             <span className="text-black dark:text-white">{t('common.article')}</span>
             {translating && <span className="text-orange-500 animate-pulse text-[10px]">Translating...</span>}
           </div>
           
           <div className="flex items-center gap-2">
             <div className="flex items-center gap-1 mr-2 border-r border-gray-200 dark:border-[#222] pr-2">
               <Link 
                 href={adjacentArticles.next ? `/news/${adjacentArticles.next.slug.current}` : '#'} 
                 className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-[#222] transition-colors ${!adjacentArticles.next ? 'opacity-30 pointer-events-none' : ''}`}
                 title="Previous Article"
               >
                 <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-[#999]" />
               </Link>
               <Link 
                 href={adjacentArticles.prev ? `/news/${adjacentArticles.prev.slug.current}` : '#'} 
                 className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-[#222] transition-colors ${!adjacentArticles.prev ? 'opacity-30 pointer-events-none' : ''}`}
                 title="Next Article"
               >
                 <ChevronRight className="w-4 h-4 text-gray-600 dark:text-[#999]" />
               </Link>
             </div>
             <input type="text" placeholder={t('search.placeholder')} className="bg-gray-100 dark:bg-[#0b0f12] border-none rounded px-2 py-1 text-xs w-24 focus:w-32 transition-all outline-none" />
           </div>
        </header>

        {/* Article Detail */}
        <article className={`max-w-3xl mx-auto px-6 py-8 transition-opacity duration-300 ${translating ? 'opacity-50' : 'opacity-100'}`}>
          
          {/* Header Info */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#eaeaea] mb-3 leading-tight">
              {displayArticle.title}
            </h1>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#777]">
               <div className="flex items-center gap-1">
                 <span className="font-semibold text-orange-600 dark:text-[#ff9c33]">Fi.News AI</span>
                 <span>•</span>
                 <TimeAgo dateString={displayArticle.publishedAt} />
               </div>
               
               {language !== 'en' && (
                 <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-[#002b4d] text-blue-700 dark:text-[#3aa5ff] uppercase tracking-wide font-bold text-[10px]">
                   Translated by AI
                 </span>
               )}

               {displayArticle.source && (
                 <>
                   <span>•</span>
                   <span>{t('article.source')}: {displayArticle.source}</span>
                 </>
               )}
               
               {displayArticle.category && (
                 <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#222] uppercase tracking-wide font-bold text-[10px]">
                   {displayArticle.category}
                 </span>
               )}
            </div>
          </div>

          {/* AI Summary Box */}
          {displayArticle.summary && (
            <div className="bg-gray-50 dark:bg-[#15191c] border-l-4 border-orange-500 p-4 mb-8 rounded-r">
              <h3 className="text-xs font-bold text-gray-500 dark:text-[#777] uppercase mb-2">{t('article.ai_summary')}</h3>
              <p className="text-sm text-gray-700 dark:text-[#ccc] leading-relaxed italic">
                {displayArticle.summary}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-12 prose-a:text-blue-600 dark:prose-a:text-[#3aa5ff] prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-[#eaeaea] text-gray-800 dark:text-[#d1d1d1]">
            {displayArticle.content ? (
              <PortableText value={displayArticle.content} />
            ) : (
              <p className="text-gray-500 italic">No content available.</p>
            )}
          </div>

          {/* Original Source Link */}
          {displayArticle.sourceUrl && (
            <div className="mb-12 pt-4 border-t border-gray-100 dark:border-[#222]">
              <a 
                href={displayArticle.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-[#3aa5ff] hover:underline font-medium"
              >
                {t('article.read_original')} {displayArticle.source || 'Source'} →
              </a>
            </div>
          )}

        </article>

        {/* Divider */}
        <div className="h-2 bg-gray-100 dark:bg-[#15191c] border-y border-gray-200 dark:border-[#222]"></div>

        {/* Popular/Related Content */}
        <div className="bg-white dark:bg-[#0b0f12]">
           <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1a1e21]">
             <h3 className="text-sm font-bold text-gray-900 dark:text-[#eaeaea]">{t('article.popular_content')}</h3>
           </div>
           
           <ArticleFeed initialArticles={relatedArticles} />
        </div>

      </main>

      {/* Right Column (Tweets) */}
      <RightSidebar />

      {/* Far-right Market Bar */}
      <MarketSidebar />
    </div>
  )
}
