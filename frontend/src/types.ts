export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  image_url: string;
  published_at?: string | null;
  category?: string | null;
  country?: string | null;
}

export interface TrendingTopic {
  title: string;
  query: string;
  country?: string | null;
  category?: string | null;
}

export interface NewsResponse {
  count: number;
  articles: Article[];
}

export interface TrendingResponse {
  count: number;
  topics: TrendingTopic[];
}

export interface AskSource {
  title: string;
  url: string;
  source: string;
  image_url: string;
}

export interface AskResponse {
  answer: string;
  sources: AskSource[];
}

export interface FilterPayload {
  category?: string;
  country?: string;
  keyword?: string;
  date_from?: string;
  date_to?: string;
}
