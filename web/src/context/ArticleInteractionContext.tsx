'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ArticleInteraction {
  likes: number
  dislikes: number
  saves: number
  userLiked: boolean
  userDisliked: boolean
  userSaved: boolean
  isPinned?: boolean
}

interface ArticleInteractionContextType {
  interactions: Record<string, ArticleInteraction>
  isAdminMode: boolean
  toggleAdminMode: () => void
  likeArticle: (id: string, initialCount?: number) => void
  dislikeArticle: (id: string, initialCount?: number) => void
  saveArticle: (id: string, initialCount?: number) => void
  updateLikes: (id: string, count: number) => void
  togglePin: (id: string) => void
  getArticleStats: (id: string, initialLikes?: number, initialDislikes?: number, initialSaves?: number) => ArticleInteraction
}

const ArticleInteractionContext = createContext<ArticleInteractionContextType | undefined>(undefined)

export function ArticleInteractionProvider({ children }: { children: React.ReactNode }) {
  const [interactions, setInteractions] = useState<Record<string, ArticleInteraction>>({})
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('article_interactions')
    if (stored) {
      try {
        setInteractions(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse article interactions', e)
      }
    }
    const storedAdmin = localStorage.getItem('admin_mode')
    if (storedAdmin === 'true') {
        setIsAdminMode(true)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever interactions change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('article_interactions', JSON.stringify(interactions))
    }
  }, [interactions, isInitialized])

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
        const next = !prev
        localStorage.setItem('admin_mode', String(next))
        return next
    })
  }

  const getArticleStats = (id: string, initialLikes = 0, initialDislikes = 0, initialSaves = 0) => {
    const stored = interactions[id]
    if (!stored) {
      return {
        likes: initialLikes,
        dislikes: initialDislikes,
        saves: initialSaves,
        userLiked: false,
        userDisliked: false,
        userSaved: false,
        isPinned: false
      }
    }
    return stored
  }

  const updateInteraction = (id: string, updateFn: (prev: ArticleInteraction) => ArticleInteraction, initialValues: { likes: number, dislikes: number, saves: number }) => {
    setInteractions(prev => {
      // Ensure we use the existing values if they exist, otherwise initialValues
      const existing = prev[id]
      const current = existing || {
        likes: initialValues.likes,
        dislikes: initialValues.dislikes,
        saves: initialValues.saves,
        userLiked: false,
        userDisliked: false,
        userSaved: false,
        isPinned: false
      }
      
      return {
        ...prev,
        [id]: updateFn(current)
      }
    })
  }

  const updateLikes = (id: string, count: number) => {
    updateInteraction(id, (prev) => ({
        ...prev,
        likes: count
    }), { likes: 0, dislikes: 0, saves: 0 })
  }

  const togglePin = (id: string) => {
    updateInteraction(id, (prev) => ({
        ...prev,
        isPinned: !prev.isPinned
    }), { likes: 0, dislikes: 0, saves: 0 })
  }

  const likeArticle = (id: string, initialCount = 0) => {
    updateInteraction(id, (prev) => ({
      ...prev,
      likes: prev.likes + 1,
      userLiked: true
    }), { likes: initialCount, dislikes: 0, saves: 0 }) 
  }

  const dislikeArticle = (id: string, initialCount = 0) => {
    updateInteraction(id, (prev) => ({
      ...prev,
      dislikes: prev.dislikes + 1,
      userDisliked: true
    }), { likes: 0, dislikes: initialCount, saves: 0 })
  }

  const saveArticle = (id: string, initialCount = 0) => {
    updateInteraction(id, (prev) => ({
      ...prev,
      saves: prev.saves + 1,
      userSaved: true
    }), { likes: 0, dislikes: 0, saves: initialCount })
  }

  return (
    <ArticleInteractionContext.Provider value={{ 
        interactions, 
        isAdminMode,
        toggleAdminMode,
        likeArticle, 
        dislikeArticle, 
        saveArticle, 
        getArticleStats,
        updateLikes,
        togglePin
    }}>
      {children}
    </ArticleInteractionContext.Provider>
  )
}

export function useArticleInteractions() {
  const context = useContext(ArticleInteractionContext)
  if (context === undefined) {
    throw new Error('useArticleInteractions must be used within a ArticleInteractionProvider')
  }
  return context
}
