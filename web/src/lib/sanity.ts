import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

// Mock Data for fallback
const MOCK_ARTICLES = [
  {
    _id: '1',
    title: 'Oracle TikTok deal lifts AI mining stocks as bitcoin tags $88,000',
    slug: { current: 'oracle-tiktok-deal' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2min
    category: 'crypto',
    source: 'CoinDesk',
    sourceUrl: 'https://zh.panewslab.com/detail/...',
    tags: ['BTC'],
    likes: 5,
    saves: 2
  },
  {
    _id: '2',
    title: '只采借向Coinbase Prime存入2201枚BTC和7557枚ETH',
    slug: { current: 'coinbase-prime-deposit' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2min
    category: 'crypto',
    source: 'Odaily',
    sourceUrl: 'https://zh.rss.odaily.news/post/...',
    tags: ['BTC', 'ETH'],
    likes: 8,
    saves: 3
  },
  {
    _id: '3',
    title: '主流Perp DEX—多数平台交易量不足30亿美元，Lighter交易量持续下滑',
    slug: { current: 'perp-dex-volume' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2min
    category: 'crypto',
    source: 'TheBlockBeats',
    sourceUrl: 'https://zh.api.theblockbeats.news/news/...',
    tags: ['HYPE', 'ASTER'],
    likes: 3,
    saves: 1
  },
  {
    _id: '4',
    title: '数据显示交易增持 ETH，10 亿美元将持续链上买入，买在限币变在市',
    slug: { current: 'eth-accumulation' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5min
    category: 'crypto',
    source: 'ChainCatcher',
    sourceUrl: 'https://zh.chaincatcher.com/article/...',
    tags: ['ETH'],
    likes: 210, // Hot Red
    saves: 5
  },
  {
    _id: '5',
    title: 'Bitget 已上线本位 MAGMA 永续合约，杠杆区间 1-20 倍',
    slug: { current: 'bitget-magma' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5min
    category: 'crypto',
    source: 'ChainCatcher',
    sourceUrl: 'https://zh.chaincatcher.com/article/...',
    tags: ['MAGMA'],
    likes: 120, // Deep Orange
    saves: 0
  },
  {
    _id: '6',
    title: '数据：某新建钱包从币安提取 1000 枚 BTC，约合 8730 万美元',
    slug: { current: 'btc-withdraw-binance' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(), // 7min
    category: 'crypto',
    source: 'ChainCatcher',
    sourceUrl: 'https://zh.chaincatcher.com/article/...',
    tags: ['BTC'],
    likes: 60, // Orange
    saves: 1
  },
  {
    _id: '7',
    title: 'Gate will be the first platform to launch spot trading of oooo (OOOO).',
    slug: { current: 'gate-oooo' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(), // 7min
    category: 'crypto',
    source: 'Panews',
    sourceUrl: 'https://zh.panewslab.com/detail/...',
    likes: 15, // High likes (highlighted in image)
    saves: 6
  },
  {
    _id: '8',
    title: 'Trend Research withdrew another 5,011 ETH from Binance, bringing its holdings to over 610,000 ETH.',
    slug: { current: 'trend-research-eth' },
    publishedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8min
    category: 'crypto',
    source: 'Panews',
    sourceUrl: 'https://zh.panewslab.com/detail/...',
    tags: ['ETH'],
    likes: 9,
    saves: 1
  }
];

// Mock Client
const mockClient = {
  fetch: async (query: string, params?: any) => {
    console.log('Fetching with mock client:', query);
    // Simple mock logic for articles
    if (query.includes('_type == "article"')) {
       return MOCK_ARTICLES;
    }
    return [];
  }
};

export const client = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      useCdn: false,
    })
  : (mockClient as any);

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
