import type { Category } from '../../config/site';

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface RelatedCalculatorLink {
  name: string;
  path: string;
  description: string;
  badge?: string;
}

export interface RelatedArticleLink {
  slug: string;
  title: string;
  description: string;
}

export interface BlogSource {
  name: string;
  url?: string;
  citation?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: Category;
  market: 'India-Only' | 'Global' | 'Both';
  publishDate: string; // ISO 8601 (YYYY-MM-DD)
  dateModified: string; // ISO 8601 (YYYY-MM-DD)
  readTime: string; // e.g. '7 min read'
  author: string;
  type: 'Evergreen' | 'Trending' | 'Hybrid';
  summary: string;
  sources?: BlogSource[];
  relatedCalculators: RelatedCalculatorLink[];
  relatedArticles: RelatedArticleLink[];
  faqs: BlogFaq[];
  content: string; // Rich semantic HTML / Markdown content
}
