'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { getArticles, Article, translateArticle } from '@/app/actions'
import { TimeAgo } from '@/components/TimeAgo'
import { useLanguage } from './LanguageProvider'
import { Flame, ThumbsUp, Bookmark, Link as LinkIcon, Pin, Edit } from 'lucide-react'
import { useArticleInteractions } from '@/context/ArticleInteractionContext'

export function ArticleFeed({ 
  initialArticles, 
  category, 
  onArticleSelect, 
  selectedArticleId 
}: { 
  initialArticles: Article[], 
  category?: string,
  onArticleSelect?: (article: Article) => void,
  selectedArticleId?: string
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>(initialArticles)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  const { t, language } = useLanguage()
  const { interactions, isAdminMode, getArticleStats, likeArticle, saveArticle, updateLikes, togglePin } = useArticleInteractions()

  // Reset state when category changes
  useEffect(() => {
    setArticles(initialArticles)
    setDisplayedArticles(initialArticles)
    setHasMore(true)
  }, [initialArticles, category])

  // Handle translation whenever articles, language, or interactions changes
  useEffect(() => {
    let isMounted = true

    const updateTranslations = async () => {
      // Use stats from context for display
      const articlesWithStats = articles.map(article => {
        const stats = getArticleStats(article._id, article.likes, article.dislikes, article.saves)
        return {
          ...article,
          likes: stats.likes,
          dislikes: stats.dislikes,
          saves: stats.saves,
          isPinned: stats.isPinned
        }
      })

      // Sort: Pinned first, then by date (original order mostly)
      // Actually we should sort here.
      articlesWithStats.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return 0 // Keep original order for rest
      })

      if (language === 'en') {
        if (isMounted) setDisplayedArticles(articlesWithStats)
        return
      }

      const translated = await Promise.all(
        articlesWithStats.map(article => translateArticle(article, language))
      )
      
      if (isMounted) {
        setDisplayedArticles(translated)
      }
    }

    updateTranslations()

    return () => {
      isMounted = false
    }
  }, [articles, language, interactions]) // Depend on interactions to trigger re-render

  async function loadMore() {
    if (articles.length === 0) return
    const lastArticle = articles[articles.length - 1]
    const newArticles = await getArticles(lastArticle.publishedAt, category)
    
    if (newArticles.length === 0) {
      setHasMore(false)
    } else {
      // Filter out duplicates just in case
      const existingIds = new Set(articles.map((a: Article) => a._id))
      const uniqueNewArticles = newArticles.filter((a: Article) => !existingIds.has(a._id))
      
      if (uniqueNewArticles.length === 0) {
        setHasMore(false)
      } else {
        setArticles(prev => [...prev, ...uniqueNewArticles])
      }
    }
  }

  useEffect(() => {
    if (inView && hasMore) {
      loadMore()
    }
  }, [inView, hasMore])

  const handleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation()
    // Optimistic update locally? 
    // The context handles state, which triggers re-render via useEffect.
    // But we need to pass initial count if it's the first time?
    // The context's likeArticle function handles the update.
    // We just call it.
    likeArticle(articleId) 
  }

  const handleSave = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation()
    saveArticle(articleId)
  }

  // Helper function for flame color
  const getFlameColor = (likes: number) => {
    if (likes >= 1000) return 'text-red-600 fill-red-600' // Super Hot Red
    if (likes >= 500) return 'text-orange-600 fill-orange-600' // Deep Orange
    if (likes >= 100) return 'text-amber-500 fill-amber-500' // Orange
    return 'text-yellow-500 fill-yellow-500' // Yellowish
  }

  const handleEditLikes = (e: React.MouseEvent, articleId: string, currentLikes: number) => {
    e.stopPropagation()
    const input = prompt('Enter new likes count:', String(currentLikes))
    if (input !== null) {
        const num = parseInt(input, 10)
        if (!isNaN(num)) {
            updateLikes(articleId, num)
        }
    }
  }

  const handleTogglePin = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation()
    togglePin(articleId)
  }

  return (
    <div className="bg-white dark:bg-[#0d0f12]">
      {displayedArticles.map((article) => (
        <div 
          key={article._id} 
          onClick={() => onArticleSelect ? onArticleSelect(article) : null}
          className={`block group cursor-pointer ${selectedArticleId === article._id ? 'bg-blue-50 dark:bg-[#1a1e23]' : ''}`}
        >
          <div className={`flex items-start gap-3 px-4 py-2 border-b border-gray-100 dark:border-[#222] hover:bg-gray-50 dark:hover:bg-[#15191c] transition-colors ${article.isPinned ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
            
            {/* Timestamp */}
            <TimeAgo dateString={article.publishedAt} />

            {/* Content */}
            <div className="flex-1 min-w-0">
               <div className="flex items-baseline gap-2 mb-0.5">
                 <h2 className={`text-[11px] font-medium leading-snug truncate-multiline-2 flex items-center gap-1 ${
                    selectedArticleId === article._id ? 'text-blue-600 dark:text-white' : 'text-gray-700 dark:text-[#cfd3d8] group-hover:text-blue-600 dark:group-hover:text-white'
                 }`}>
                   {/* Pinned Icon */}
                   {article.isPinned && <Pin className="w-3 h-3 text-red-500 fill-red-500 shrink-0 rotate-45" />}
                   
                   {(article.likes && article.likes >= 100) && <Flame className={`w-3 h-3 shrink-0 ${getFlameColor(article.likes)}`} />}
                   {article.title}
                   {article.sourceUrl && (
                     <a 
                       href={article.sourceUrl} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-flex items-center text-gray-500 hover:text-gray-300 ml-1"
                       onClick={(e) => e.stopPropagation()}
                     >
                       <LinkIcon className="w-3 h-3" />
                       <span className="text-[10px] ml-0.5">{article.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
                     </a>
                   )}
                 </h2>
               </div>
               
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#666] flex-1 justify-end">
                   {/* Tags - Highlighted Pills */}
                   <div className="flex gap-1">
                     {article.tags && article.tags.length > 0 ? (
                       article.tags.map(tag => (
                         <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#1a1e23] text-cyan-400">
                           {tag}
                         </span>
                       ))
                     ) : (
                        // Auto tag based on category if no specific tags
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#1a1e23] text-cyan-400">
                          {article.category === 'crypto' ? 'CRYPTO' : article.category === 'finance' ? 'FINANCE' : 'NEWS'}
                        </span>
                     )}
                   </div>
                 </div>

                 {/* Likes & Saves - Hidden in new layout request but kept in code just in case, removing from view to match image */}
                 {/* 
                 <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    ...
                 </div> 
                 */}
                 {/* Admin Controls */}
                 {isAdminMode && (
                   <div className="flex items-center gap-2 ml-2">
                     <button 
                       onClick={(e) => handleEditLikes(e, article._id, article.likes || 0)}
                       className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500"
                       title="Edit Likes"
                     >
                       <Edit className="w-3 h-3" />
                     </button>
                     <button 
                       onClick={(e) => handleTogglePin(e, article._id)}
                       className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${article.isPinned ? 'text-red-500' : 'text-gray-500'}`}
                       title={article.isPinned ? "Unpin" : "Pin to Top"}
                     >
                       <Pin className="w-3 h-3" />
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div ref={ref} className="p-4 text-center text-gray-500 text-xs">
          {t('feed.loading')}
        </div>
      )}
      
      {!hasMore && articles.length > 0 && (
         <div className="p-8 text-center text-gray-500 text-xs border-t border-gray-100 dark:border-[#222]">
           {t('feed.end')}
         </div>
      )}

      {articles.length === 0 && (
        <div className="p-10 text-center text-gray-500">{t('feed.no_news')}</div>
      )}
    </div>
  )
}
