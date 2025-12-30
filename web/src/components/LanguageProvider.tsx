'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'zh' | 'ja' | 'ko' | 'fr' | 'de'

interface Dictionary {
  [key: string]: {
    [key: string]: string
  }
}

const dictionaries: Dictionary = {
  en: {
    'nav.top_news': 'Top News',
    'nav.crypto': 'Crypto',
    'nav.web3': 'Web3',
    'nav.ai': 'AI',
    'nav.domain': 'Domain',
    'nav.markets': 'Markets',
    'nav.macro': 'Macro',
    'nav.capital': 'Capital',
    'nav.companies': 'Companies',
    'nav.regulation': 'Regulation',
    'nav.data': 'Data',
    'mode.light': 'Light',
    'mode.dark': 'Dark',
    'search.placeholder': 'Search...',
    'header.show_all': 'Show All',
    'feed.loading': 'Loading more...',
    'feed.end': "You've reached the end.",
    'feed.no_news': 'No news available.',
    'article.source': 'Source',
    'article.ai_summary': 'AI Summary',
    'article.read_original': 'Read original article at',
    'article.popular_content': 'Popular Content',
    'sidebar.trending': 'Trending on X',
    'sidebar.ad': 'ADVERTISEMENT',
    'sidebar.ad_here': 'Your Ad Here',
    'market.crypto': 'CRYPTO',
    'market.global': 'GLOBAL',
    'market.rotation': 'ROTATION',
    'common.article': 'Article',
  },
  zh: {
    'nav.top_news': '头条新闻',
    'nav.crypto': '加密货币',
    'nav.web3': 'Web3',
    'nav.ai': '人工智能',
    'nav.domain': '域名',
    'nav.markets': '市场',
    'nav.macro': '宏观',
    'nav.capital': '资本',
    'nav.companies': '公司',
    'nav.regulation': '监管',
    'nav.data': '数据',
    'mode.light': '浅色',
    'mode.dark': '深色',
    'search.placeholder': '搜索...',
    'header.show_all': '查看全部',
    'feed.loading': '加载中...',
    'feed.end': "已经到底了。",
    'feed.no_news': '暂无新闻。',
    'article.source': '来源',
    'article.ai_summary': 'AI 摘要',
    'article.read_original': '阅读原文：',
    'article.popular_content': '热门内容',
    'sidebar.trending': 'X (推特) 趋势',
    'sidebar.ad': '广告',
    'sidebar.ad_here': '广告位招租',
    'market.crypto': '加密货币',
    'market.global': '全球市场',
    'market.rotation': '板块轮动',
    'common.article': '文章',
  },
  ja: {
    'nav.top_news': 'トップニュース',
    'nav.crypto': '暗号資産',
    'nav.web3': 'Web3',
    'nav.ai': 'AI',
    'nav.domain': 'ドメイン',
    'nav.markets': '市況',
    'nav.macro': 'マクロ',
    'nav.capital': '資本',
    'nav.companies': '企業',
    'nav.regulation': '規制',
    'nav.data': 'データ',
    'mode.light': 'ライト',
    'mode.dark': 'ダーク',
    'search.placeholder': '検索...',
    'header.show_all': 'すべて表示',
    'feed.loading': '読み込み中...',
    'feed.end': "これ以上ありません。",
    'feed.no_news': 'ニュースはありません。',
    'article.source': 'ソース',
    'article.ai_summary': 'AI サマリー',
    'article.read_original': '元の記事を読む：',
    'article.popular_content': '人気のコンテンツ',
    'sidebar.trending': 'X (Twitter) トレンド',
    'sidebar.ad': '広告',
    'sidebar.ad_here': '広告スペース',
    'market.crypto': '暗号資産',
    'market.global': 'グローバル',
    'market.rotation': 'セクター',
    'common.article': '記事',
  },
  ko: {
    'nav.top_news': '주요 뉴스',
    'nav.crypto': '크립토',
    'nav.web3': 'Web3',
    'nav.ai': 'AI',
    'nav.domain': '도메인',
    'nav.markets': '시장',
    'nav.macro': '거시경제',
    'nav.capital': '자본',
    'nav.companies': '기업',
    'nav.regulation': '규제',
    'nav.data': '데이터',
    'mode.light': '라이트',
    'mode.dark': '다크',
    'search.placeholder': '검색...',
    'header.show_all': '모두 보기',
    'feed.loading': '로딩 중...',
    'feed.end': "마지막입니다.",
    'feed.no_news': '뉴스가 없습니다.',
    'article.source': '출처',
    'article.ai_summary': 'AI 요약',
    'article.read_original': '원본 기사 읽기:',
    'article.popular_content': '인기 콘텐츠',
    'sidebar.trending': 'X (트위터) 트렌드',
    'sidebar.ad': '광고',
    'sidebar.ad_here': '광고 문의',
    'market.crypto': '크립토',
    'market.global': '글로벌',
    'market.rotation': '순환',
    'common.article': '기사',
  },
  fr: {
    'nav.top_news': 'À la une',
    'nav.crypto': 'Crypto',
    'nav.web3': 'Web3',
    'nav.ai': 'IA',
    'nav.domain': 'Domaine',
    'nav.markets': 'Marchés',
    'nav.macro': 'Macro',
    'nav.capital': 'Capital',
    'nav.companies': 'Entreprises',
    'nav.regulation': 'Régulation',
    'nav.data': 'Données',
    'mode.light': 'Clair',
    'mode.dark': 'Sombre',
    'search.placeholder': 'Rechercher...',
    'header.show_all': 'Tout voir',
    'feed.loading': 'Chargement...',
    'feed.end': "Vous avez atteint la fin.",
    'feed.no_news': 'Aucune actualité disponible.',
    'article.source': 'Source',
    'article.ai_summary': 'Résumé IA',
    'article.read_original': "Lire l'article original sur",
    'article.popular_content': 'Contenu populaire',
    'sidebar.trending': 'Tendances sur X',
    'sidebar.ad': 'PUBLICITÉ',
    'sidebar.ad_here': 'Votre publicité ici',
    'market.crypto': 'CRYPTO',
    'market.global': 'MONDE',
    'market.rotation': 'ROTATION',
    'common.article': 'Article',
  },
  de: {
    'nav.top_news': 'Top News',
    'nav.crypto': 'Krypto',
    'nav.web3': 'Web3',
    'nav.ai': 'KI',
    'nav.domain': 'Domain',
    'nav.markets': 'Märkte',
    'nav.macro': 'Makro',
    'nav.capital': 'Kapital',
    'nav.companies': 'Unternehmen',
    'nav.regulation': 'Regulierung',
    'nav.data': 'Daten',
    'mode.light': 'Hell',
    'mode.dark': 'Dunkel',
    'search.placeholder': 'Suchen...',
    'header.show_all': 'Alle anzeigen',
    'feed.loading': 'Lädt...',
    'feed.end': "Das ist das Ende.",
    'feed.no_news': 'Keine Nachrichten verfügbar.',
    'article.source': 'Quelle',
    'article.ai_summary': 'KI-Zusammenfassung',
    'article.read_original': 'Originalartikel lesen bei',
    'article.popular_content': 'Beliebte Inhalte',
    'sidebar.trending': 'Trends auf X',
    'sidebar.ad': 'WERBUNG',
    'sidebar.ad_here': 'Werben Sie hier',
    'market.crypto': 'KRYPTO',
    'market.global': 'GLOBAL',
    'market.rotation': 'ROTATION',
    'common.article': 'Artikel',
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && dictionaries[savedLang]) {
      setLanguage(savedLang)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
    }
  }, [language, mounted])

  const t = (key: string) => {
    return dictionaries[language][key] || dictionaries['en'][key] || key
  }

  if (!mounted) {
    // Return a dummy provider during SSR/hydration to avoid errors
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, t: (key) => dictionaries['en'][key] || key }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
