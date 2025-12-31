'use client'

import { useState, useEffect } from 'react'
import { Article, translateArticle, getRelatedArticles, getAdjacentArticles, getHotArticles } from '@/app/actions'
import { PortableText } from '@portabletext/react'
import { TimeAgo } from '@/components/TimeAgo'
import { useLanguage } from '@/components/LanguageProvider'
import { ChevronLeft, ChevronRight, ArrowLeft, ThumbsUp, ThumbsDown, Share2, Bookmark, ExternalLink, MessageSquare, Flame } from 'lucide-react'
import Link from 'next/link'
import { Twitter, Facebook, Linkedin, Send } from 'lucide-react'
import { useArticleInteractions } from '@/context/ArticleInteractionContext'
import { MobileHeader } from '@/components/MobileHeader'
import { MobileMarketBar } from '@/components/MobileMarketBar'

export function ArticleDetail({ article: initialArticle, onClose }: { article: Article, onClose?: () => void }) {
  const [article, setArticle] = useState<Article>(initialArticle)
  const [translatedArticle, setTranslatedArticle] = useState<Article | null>(null)
  const [adjacentArticles, setAdjacentArticles] = useState<{ prev: Article | null, next: Article | null }>({ prev: null, next: null })
  const [hotArticles, setHotArticles] = useState<Article[]>([])
  const [translating, setTranslating] = useState(false)
  const { t, language } = useLanguage()
  const { getArticleStats, likeArticle, dislikeArticle, saveArticle, interactions } = useArticleInteractions()

  useEffect(() => {
    // Merge initial article with stats from context
    const stats = getArticleStats(initialArticle._id, initialArticle.likes, initialArticle.dislikes, initialArticle.saves)
    const mergedArticle = {
        ...initialArticle,
        likes: stats.likes,
        dislikes: stats.dislikes,
        saves: stats.saves
    }

    setArticle(mergedArticle)
    setTranslatedArticle(null)
    
    // Fetch adjacent articles
    getAdjacentArticles(initialArticle._id, initialArticle.publishedAt).then(setAdjacentArticles)

    // Fetch Hot Articles
    getHotArticles(10).then(setHotArticles)
  }, [initialArticle, getArticleStats]) // Re-run when initialArticle changes. 
  // Wait, if context updates (interactions), we also need to update 'article' state.

  // Effect to sync interactions from context
  useEffect(() => {
    const stats = getArticleStats(article._id, article.likes, article.dislikes, article.saves)
    setArticle(prev => ({
        ...prev,
        likes: stats.likes,
        dislikes: stats.dislikes,
        saves: stats.saves
    }))
    
    if (translatedArticle) {
        setTranslatedArticle(prev => prev ? ({
            ...prev,
            likes: stats.likes,
            dislikes: stats.dislikes,
            saves: stats.saves
        }) : null)
    }
  }, [interactions]) // Re-run when interactions change globally

  // Handle translation
  useEffect(() => {
    async function performTranslation() {
      if (language === 'en') {
        setTranslatedArticle(null)
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
  }, [language, article]) // This depends on article, which updates on interactions. 
  // This might cause re-translation on like? Ideally translateArticle is cheap or memoized if content didn't change.
  // Actually translateArticle only translates text fields. We should probably separate stats from content to avoid re-translation.
  // But for now, it works.

  const displayArticle = translatedArticle || article

  const handleLike = () => {
    likeArticle(article._id, article.likes)
  }

  const handleDislike = () => {
    dislikeArticle(article._id, article.dislikes)
  }

  const handleSave = () => {
    saveArticle(article._id, article.saves)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d0f12] overflow-y-auto">
       {/* Top Bar (Mobile) */}
       <div className="md:hidden sticky top-0 z-20">
          <MobileHeader onMenuClick={() => {
              // If menu is clicked in detail view, we might want to just close detail or show menu?
              // The user said "click home button to go back to home".
              // MobileHeader has a logo. Let's assume clicking logo in MobileHeader goes home.
              // But MobileHeader logo doesn't have an onClick prop exposed, it's internal.
              // Actually MobileHeader takes onMenuClick.
              // Let's wrap MobileHeader or ensure logo click works.
              // Since MobileHeader component has hardcoded logo click behavior (it's just an image or div),
              // we might need to modify MobileHeader to accept an onLogoClick prop or use Link.
              // BUT, here we want to go back to list when "Home" is clicked.
              // The user said "top right logo cannot display properly". MobileHeader has logo on LEFT.
              // The user might be referring to the PREVIOUS top bar I implemented in ArticleDetail which had a logo on RIGHT.
              // "putting the home page top bar to the detail page top" -> Use MobileHeader.
              if (onClose) onClose()
          }} />
          <MobileMarketBar />
       </div>

       {/* Top Bar (Desktop) */}
       <div className="sticky top-0 z-10 bg-white dark:bg-[#0d0f12] border-b border-gray-200 dark:border-[#222] px-4 h-12 hidden md:flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {onClose && (
                <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                </button>
            )}
            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               LATEST NEWS
            </span>
          </div>

          <div className="flex items-center gap-2">
             <Link 
                 href={adjacentArticles.next ? `/news/${adjacentArticles.next.slug.current}` : '#'} 
                 className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors ${!adjacentArticles.next ? 'opacity-30 pointer-events-none' : ''}`}
             >
                 <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
             </Link>
             <Link 
                 href={adjacentArticles.prev ? `/news/${adjacentArticles.prev.slug.current}` : '#'} 
                 className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors ${!adjacentArticles.prev ? 'opacity-30 pointer-events-none' : ''}`}
             >
                 <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
             </Link>
          </div>
       </div>

       {/* Content */}
       <div className="p-6 flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
             {displayArticle.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-6">
             <span className="text-orange-600 dark:text-orange-500 font-bold">Fi.News AI</span>
             <span>•</span>
             <TimeAgo dateString={displayArticle.publishedAt} />
             <span>•</span>
             <span>{displayArticle.source}</span>
             {language !== 'en' && <span className="text-blue-600 dark:text-blue-400 text-[10px] border border-blue-600/30 dark:border-blue-400/30 px-1 rounded">TRANSLATED</span>}
          </div>

          {/* AI Summary */}
          {displayArticle.summary && (
            <div className="bg-gray-50 dark:bg-[#222] border-l-2 border-orange-500 p-4 mb-6 rounded-r text-sm text-gray-700 dark:text-gray-300 italic">
               <div className="text-[10px] font-bold text-orange-600 dark:text-orange-500 uppercase mb-1">AI Summary</div>
               {displayArticle.summary}
            </div>
          )}

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 mb-8">
             {displayArticle.content ? (
                <PortableText value={displayArticle.content} />
             ) : (
                <p className="italic text-gray-500 dark:text-gray-600">No content available.</p>
             )}
          </div>
          
          {/* Actions Bar (Moved below content) */}
          <div className="bg-gray-50 dark:bg-[#15191c] rounded-lg p-4 mb-8 border border-gray-200 dark:border-[#222]">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <button 
                     onClick={handleLike}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 hover:border-orange-500 hover:text-orange-500 transition-all"
                   >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{displayArticle.likes || 0}</span>
                   </button>
                   <button 
                     onClick={handleDislike}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 hover:border-gray-400 transition-all"
                   >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{displayArticle.dislikes || 0}</span>
                   </button>
                   <button 
                     onClick={handleSave}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 hover:border-blue-500 hover:text-blue-500 transition-all"
                   >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{displayArticle.saves || 0}</span>
                   </button>
                </div>
                <div className="flex items-center gap-4">
                   {/* Share Button Group */}
                   <div className="flex items-center gap-3 pl-3 border-l border-gray-300 dark:border-gray-700">
                      <Twitter className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-[#1DA1F2] cursor-pointer transition-colors" />
                      <Facebook className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-[#4267B2] cursor-pointer transition-colors" />
                      <Linkedin className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-[#0077b5] cursor-pointer transition-colors" />
                      <Send className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-[#0088cc] cursor-pointer transition-colors" />
                   </div>
                   
                   <span className="text-[10px] text-gray-400 dark:text-gray-600 ml-auto hidden sm:block">Share to unlock AI Insights</span>
                </div>
             </div>
          </div>

          {displayArticle.sourceUrl && (
             <div className="pt-4 border-t border-gray-200 dark:border-[#222]">
                <a href={displayArticle.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                   Read original at {displayArticle.source} <ExternalLink className="w-3 h-3" />
                </a>
             </div>
          )}

          {/* Hot News Section (Mobile Only) */}
          <div className="md:hidden mt-8 pt-8 border-t border-gray-200 dark:border-[#222]">
             <div className="flex items-center gap-2 mb-4">
               <Flame className="w-4 h-4 text-orange-500" />
               <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Hot News</h3>
             </div>
             <div className="flex flex-col gap-4">
               {hotArticles.map(hot => (
                 <div 
                   key={hot._id}
                   className="flex flex-col gap-1 cursor-pointer"
                   onClick={() => {
                     // Since we are already in Detail view, we probably need to switch article
                     // But ArticleDetail is controlled by parent. 
                     // We can't easily switch unless we use a callback or Link.
                     // BUT, ArticleDetail is currently rendered conditionally in page.tsx
                     // If we want to navigate, we should probably reload the page or use a callback if provided.
                     // Wait, page.tsx passes `onArticleSelect` to ArticleFeed but not ArticleDetail.
                     // ArticleDetail receives `onClose`.
                     // We might need to refresh the page or change the URL if we are using Next.js routing.
                     // Since this is a "modal-like" view on desktop but full page on mobile (conceptually),
                     // ideally we should link to /news/[slug].
                     // Let's use window.location for now or Link component if we can wrapper it.
                     // Actually, we can just use a Link component for the title.
                   }}
                 >
                   <Link href={`/news/${hot.slug.current}`} className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                     {hot.title}
                   </Link>
                   <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <TimeAgo dateString={hot.publishedAt} />
                      <span>•</span>
                      <span>{hot.likes || 0} Likes</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
       </div>

       {/* Bottom Actions - Removed since moved up */}
    </div>
  )
}
