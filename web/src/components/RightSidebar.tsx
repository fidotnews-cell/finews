'use client'

import { useState, useEffect } from 'react'
import { getSiteSettings, getTweets, SiteSettings, Tweet, Article, getArticles } from '@/app/actions'
import { urlFor } from '@/lib/sanity'
import { useLanguage } from './LanguageProvider'
import { useArticleInteractions } from '@/context/ArticleInteractionContext'
import { Flame, Bookmark, ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function RightSidebar({ onArticleSelect }: { onArticleSelect?: (article: Article) => void }) {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [topLikedArticles, setTopLikedArticles] = useState<Article[]>([])
  const { t } = useLanguage()
  const { interactions, getArticleStats } = useArticleInteractions()

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error)
    getTweets().then(setTweets).catch(console.error)
  }, [])

  // Calculate Top News based on interactions context + initial data
  // Since we don't have all articles in context, we might need to rely on what we have.
  // For this demo, let's re-fetch articles and apply sort.
  useEffect(() => {
    async function updateTopNews() {
        const allArticles = await getArticles(null) // Fetch latest 30
        
        const articlesWithStats = allArticles.map((article: Article) => {
            const stats = getArticleStats(article._id, article.likes, article.dislikes, article.saves)
            return {
                ...article,
                likes: stats.likes,
                saves: stats.saves
            }
        })

        // Sort by likes
        const sortedByLikes = [...articlesWithStats].sort((a, b) => (b.likes || 0) - (a.likes || 0))
        setTopLikedArticles(sortedByLikes.slice(0, 10))
    }

    updateTopNews()
  }, [interactions]) // Re-calc when interactions change

  return (
    <aside className="w-full h-full bg-white dark:bg-[#0d0f12] flex flex-col overflow-y-auto border-l border-gray-200 dark:border-[#222]">
      
      {/* Top Liked Section Header */}
      <div className="h-12 border-b border-gray-200 dark:border-[#222] flex items-center px-4 bg-white dark:bg-[#15191c] sticky top-0 z-10">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-500" />
            Hot News
          </h3>
      </div>
      
      {/* Top Liked List */}
      <div className="p-4 border-b border-gray-200 dark:border-[#222]">
        <div className="space-y-3">
            {topLikedArticles.map((article, index) => (
                <div key={article._id} className="group cursor-pointer" onClick={() => onArticleSelect?.(article)}>
                    <div className="flex items-start gap-3">
                        <span className={`text-[10px] font-bold w-4 mt-0.5 ${index < 3 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-medium text-gray-700 dark:text-gray-300 leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                                {article.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-gray-400">{new Date(article.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className="text-[9px] text-orange-500 flex items-center gap-0.5">
                                    <Flame className="w-2 h-2" /> {formatNumber(article.likes || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* More Button */}
      <div className="p-4">
        <Link 
            href="/" 
            className="flex items-center justify-center w-full py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-xs font-medium text-gray-600 dark:text-gray-300 rounded transition-colors"
        >
            View More <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

    </aside>
  )
}
