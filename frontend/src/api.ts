// All HTTP calls go through the native fetch() API. No axios anywhere.
import type {
  AskResponse,
  FilterPayload,
  NewsResponse,
  TrendingResponse,
} from "./types";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export interface MetaResponse {
  categories: string[];
  countries: { code: string; name: string }[];
}

export const api = {
  trending: () => request<TrendingResponse>("/trending"),
  news: () => request<NewsResponse>("/news"),
  meta: () => request<MetaResponse>("/meta"),
  filter: (payload: FilterPayload) =>
    request<NewsResponse>("/filter", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  ask: (query: string, top_k = 4) =>
    request<AskResponse>("/ask", {
      method: "POST",
      body: JSON.stringify({ query, top_k }),
    }),
  summarize: (content: string, title?: string) =>
    request<{ summary: string }>("/summarize", {
      method: "POST",
      body: JSON.stringify({ content, title }),
    }),
};
