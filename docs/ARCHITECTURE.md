# Fi.News 多智能体架构文档

## 1. 项目概览
Fi.News 是一个 AI 驱动的金融/加密/Web3 新闻自动化平台。
目标：构建一个自动化的新闻聚合、处理和展示系统。

## 2. 智能体职责划分

### 🤖 产品经理智能体 (Product Manager Agent)
*   **核心职责**: 定义产品边界，确保 MVP 快速上线。
*   **MVP 范围**:
    *   **新闻流 (News Feed)**: 按时间排序的最新新闻。
    *   **分类 (Categories)**: Crypto, Web3, Finance, AI。
    *   **详情页 (Detail View)**: 文章完整内容、来源链接、AI 摘要。
*   **内容规则**:
    *   仅聚合高信誉源 (CoinDesk, Cointelegraph, Bloomberg 等)。
    *   AI 处理必须包含：摘要生成、情感分析、标签提取。

### ⚙️ 后端/自动化智能体 (Backend/Automation Agent)
*   **核心职责**: 数据管道与内容管理。
*   **Sanity CMS (Studio)**:
    *   定义数据模型 (Schema): Article, Author, Category.
    *   管理内容审核工作流。
*   **n8n Automation**:
    *   **Ingest**: RSS/API 抓取。
    *   **Process**: 调用 LLM (OpenAI/Anthropic) 进行清洗、摘要、翻译。
    *   **Store**: 通过 Sanity API 写入数据库。

### 🎨 前端智能体 (Frontend Agent)
*   **核心职责**: 用户体验与界面实现。
*   **技术栈**: Next.js (App Router), Tailwind CSS, Sanity Client。
*   **页面架构**:
    *   `src/app/page.tsx`: 首页 (新闻流)。
    *   `src/app/[category]/page.tsx`: 分类页。
    *   `src/app/news/[slug]/page.tsx`: 文章详情页。
*   **关键组件**: NewsCard, Header, Footer, CategoryFilter.

## 3. 目录结构规划
建议将项目重构为以下结构以支持多模块开发：
```
/finews
  ├── studio/       # Sanity CMS (当前根目录内容建议移动至此)
  ├── web/          # Next.js 前端应用
  ├── n8n/          # n8n 工作流备份与 Docker 配置
  └── docs/         # 项目文档
```

## 4. MVP 执行路线图
1.  **Phase 1: 数据层准备 (Backend Agent)**
    *   完善 Sanity Schema (Article, Category)。
    *   确保 n8n 能成功写入测试数据。
2.  **Phase 2: 前端核心构建 (Frontend Agent)**
    *   初始化 Next.js 项目。
    *   连接 Sanity 数据源。
    *   实现首页新闻流展示。
3.  **Phase 3: 详情与优化 (Product + Frontend)**
    *   文章详情页。
    *   移动端适配。
    *   部署上线。
