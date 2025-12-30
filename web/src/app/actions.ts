'use server'

import { client } from '@/lib/sanity'

export interface Article {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  summary?: string
  content?: any[]
  category?: string
  source?: string
  sourceUrl?: string
  tags?: string[]
  likes?: number
  dislikes?: number
  saves?: number
  isPinned?: boolean
}

export async function getArticles(lastPublishedAt: string | null, category?: string) {
  const query = category
    ? `*[_type == "article" && category == $category && ($lastPublishedAt == null || publishedAt < $lastPublishedAt)] | order(publishedAt desc) [0...30] {
        _id,
        title,
        slug,
        publishedAt,
        summary,
        category,
        source,
        likes,
        dislikes,
        saves
      }`
    : `*[_type == "article" && ($lastPublishedAt == null || publishedAt < $lastPublishedAt)] | order(publishedAt desc) [0...30] {
        _id,
        title,
        slug,
        publishedAt,
        summary,
        category,
        source,
        likes,
        dislikes,
        saves
      }`

  const params = {
    category,
    lastPublishedAt
  }

  return client.fetch<Article[]>(query, params)
}

export async function getArticleBySlug(slug: string) {
  return client.fetch<Article>(
    `*[_type == "article" && slug.current == $slug][0]`,
    { slug }
  )
}

export async function getRelatedArticles(currentId: string) {
  // Fetch 20 latest articles excluding the current one
  return client.fetch<Article[]>(
    `*[_type == "article" && _id != $currentId] | order(publishedAt desc) [0...20] {
      _id,
      title,
      slug,
      publishedAt,
      summary,
      category,
      source
    }`,
    { currentId }
  )
}

export interface SiteSettings {
  title: string
  logo: any
  sidebarAd: {
    image: any
    url: string
    active: boolean
  }
}

export async function getSiteSettings() {
  return client.fetch<SiteSettings>(
    `*[_type == "siteSettings"][0]`
  )
}

export interface Tweet {
  _id: string
  authorName: string
  authorHandle: string
  authorAvatar: string
  content: string
  sourceUrl: string
  publishedAt: string
  likes: number
  retweets: number
  views: number
}

export async function getTweets() {
  return client.fetch<Tweet[]>(
    `*[_type == "tweet"] | order(publishedAt desc) [0...20]`
  )
}

export async function getAdjacentArticles(currentId: string, publishedAt: string) {
  const [prev, next] = await Promise.all([
    client.fetch<Article>(
      `*[_type == "article" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
        _id,
        title,
        slug
      }`,
      { publishedAt }
    ),
    client.fetch<Article>(
      `*[_type == "article" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
        _id,
        title,
        slug
      }`,
      { publishedAt }
    )
  ])
  return { prev, next }
}

// Mock translation service

// Mock translation service
const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    'Bitcoin': '比特币',
    'Crypto': '加密货币',
    'Ethereum': '以太坊',
    'Market': '市场',
    'Price': '价格',
    'Analysis': '分析',
    'SEC': '美国证券交易委员会',
    'ETF': '交易所交易基金',
    'Bull': '牛市',
    'Bear': '熊市',
    'AI': '人工智能',
    'Blockchain': '区块链',
    'Oracle': '甲骨文',
    'TikTok': '抖音',
    'deal': '交易',
    'lifts': '提振',
    'mining': '挖矿',
    'stocks': '股票',
    'tags': '触及',
    'shares': '股价',
    'jumped': '跳涨',
    'pre-market': '盘前交易',
    'Friday': '周五',
    'agreement': '协议',
    'helped': '帮助',
    'calm': '平息',
    'bubble': '泡沫',
    'fears': '担忧',
    'volatile': '波动',
    'macro': '宏观',
    'week': '周',
    "Here’s why current wobbles in stock market darlings may not be a sign of troubles ahead": "为何当前股市宠儿的波动可能并非未来麻烦的征兆",
    "A more critical view of AI winners is sensible, says Nomura analyst": "野村证券分析师表示，对人工智能赢家持更批判性的看法是明智的",
  },
  ja: {
    'Bitcoin': 'ビットコイン',
    'Crypto': '暗号資産',
    'Ethereum': 'イーサリアム',
    'Market': '市場',
    'Price': '価格',
    'Analysis': '分析',
    'SEC': '証券取引委員会',
    'ETF': '上場投資信託',
    'Bull': '強気',
    'Bear': '弱気',
    'AI': '人工知能',
    'Blockchain': 'ブロックチェーン',
  },
  ko: {
    'Bitcoin': '비트코인',
    'Crypto': '암호화폐',
    'Ethereum': '이더리움',
    'Market': '시장',
    'Price': '가격',
    'Analysis': '분석',
    'SEC': '증권거래위원회',
    'ETF': '상장지수펀드',
    'Bull': '강세',
    'Bear': '약세',
    'AI': '인공지능',
    'Blockchain': '블록체인',
  },
  fr: {
    'Bitcoin': 'Bitcoin',
    'Crypto': 'Crypto',
    'Ethereum': 'Ethereum',
    'Market': 'Marché',
    'Price': 'Prix',
    'Analysis': 'Analyse',
    'SEC': 'SEC',
    'ETF': 'ETF',
    'Bull': 'Haussier',
    'Bear': 'Baissier',
    'AI': 'IA',
    'Blockchain': 'Blockchain',
  },
  de: {
    'Bitcoin': 'Bitcoin',
    'Crypto': 'Krypto',
    'Ethereum': 'Ethereum',
    'Market': 'Markt',
    'Price': 'Preis',
    'Analysis': 'Analyse',
    'SEC': 'SEC',
    'ETF': 'ETF',
    'Bull': 'Bulle',
    'Bear': 'Bär',
    'AI': 'KI',
    'Blockchain': 'Blockchain',
  },
}

function mockTranslateText(text: string, targetLang: string): string {
  if (targetLang === 'en') return text
  
  let translated = text
  const dict = MOCK_TRANSLATIONS[targetLang] || {}
  
  // Simple word replacement
  Object.entries(dict).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    translated = translated.replace(regex, value)
  })
  
  // Add prefix to indicate translation
  // return `[${targetLang.toUpperCase()}] ${translated}`
  return translated
}

const MOCK_CONTENT_MAP: Record<string, any[]> = {
  en: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'This content is not available in the database. Please visit the original source to read the full article.',
        }
      ]
    }
  ],
  zh: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: '数据库中暂无此文章的详细内容。请访问原始来源阅读全文。',
        }
      ]
    }
  ],
  ja: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'このコンテンツはデータベースにありません。全文を読むには元のソースにアクセスしてください。',
        }
      ]
    }
  ],
  ko: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: '이 콘텐츠는 데이터베이스에 없습니다. 전체 기사를 읽으려면 원본 소스를 방문하십시오.',
        }
      ]
    }
  ],
  fr: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Ce contenu n\'est pas disponible dans la base de données. Veuillez visiter la source originale pour lire l\'article complet.',
        }
      ]
    }
  ],
  de: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Dieser Inhalt ist nicht in der Datenbank verfügbar. Bitte besuchen Sie die Originalquelle, um den vollständigen Artikel zu lesen.',
        }
      ]
    }
  ]
}

export async function translateArticle(article: Article, targetLang: string): Promise<Article> {
  if (targetLang === 'en') return article

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const translatedArticle = { ...article }

  // Use mock content if original content is empty
  if (!translatedArticle.content || translatedArticle.content.length === 0) {
    translatedArticle.content = MOCK_CONTENT_MAP[targetLang] || MOCK_CONTENT_MAP['en']
  }

  // Translate title
  translatedArticle.title = mockTranslateText(translatedArticle.title, targetLang)

  // Translate summary
  if (translatedArticle.summary) {
    translatedArticle.summary = mockTranslateText(translatedArticle.summary, targetLang)
  }

  // Translate content (PortableText)
  if (translatedArticle.content) {
    translatedArticle.content = translatedArticle.content.map(block => {
      if (block._type === 'block' && block.children) {
        return {
          ...block,
          children: block.children.map((child: any) => {
            if (child._type === 'span' && child.text) {
              return {
                ...child,
                text: mockTranslateText(child.text, targetLang)
              }
            }
            return child
          })
        }
      }
      return block
    })
  }

  return translatedArticle
}
