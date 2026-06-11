import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api";
import AskBox from "../components/AskBox";
import FeaturedCard from "../components/FeaturedCard";
import FilterBar from "../components/FilterBar";
import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import NewsCardSkeleton from "../components/NewsCardSkeleton";
import TrendingSidebar from "../components/TrendingSidebar";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_COUNTRIES,
  type CountryOption,
} from "../constants/countries";
import type { Article, FilterPayload, TrendingTopic } from "../types";

const AUTO_REFRESH_MS = 30 * 60 * 1000;

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [countries, setCountries] = useState<CountryOption[]>(FALLBACK_COUNTRIES);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterBusy, setFilterBusy] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterPayload | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const filterRef = useRef<FilterPayload | null>(null);

  const loadMeta = useCallback(async () => {
    try {
      const res = await api.meta();
      if (res.categories?.length) setCategories(res.categories);
      if (res.countries?.length) setCountries(res.countries);
    } catch (err) {
      console.warn("meta fetch failed; using fallback", err);
    }
  }, []);

  const loadTrending = useCallback(async () => {
    setLoadingTrending(true);
    try {
      const res = await api.trending();
      setTrending(res.topics);
    } catch (err) {
      console.error("trending fetch failed", err);
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  const loadNews = useCallback(async () => {
    setLoadingNews(true);
    setError(null);
    try {
      const current = filterRef.current;
      const res = current ? await api.filter(current) : await api.news();
      setArticles(res.articles);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    loadMeta();
    loadTrending();
    loadNews();
    const interval = window.setInterval(() => {
      loadTrending();
      loadNews();
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [loadMeta, loadTrending, loadNews]);

  const applyFilter = async (payload: FilterPayload) => {
    setFilterBusy(true);
    setError(null);
    try {
      const res = await api.filter(payload);
      filterRef.current = payload;
      setActiveFilter(payload);
      setArticles(res.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Filter failed");
    } finally {
      setFilterBusy(false);
    }
  };

  const resetFilter = async () => {
    filterRef.current = null;
    setActiveFilter(null);
    await loadNews();
  };

  const pickTrending = (query: string) => {
    applyFilter({ keyword: query });
  };

  const [featured, ...rest] = articles;

  return (
    <>
      <Hero lastRefresh={lastRefresh} />
      <div className="container">
        <AskBox />
        <FilterBar
          categories={categories}
          countries={countries.map((c) => c.name)}
          onApply={applyFilter}
          onReset={resetFilter}
          busy={filterBusy}
        />
        {activeFilter && (
          <p className="filter-note">
            Showing filtered results ·{" "}
            <button className="link-btn" onClick={resetFilter}>
              Clear all
            </button>
          </p>
        )}
        {error && <p className="alert alert--error">⚠️ {error}</p>}

        <div className="dashboard-layout">
          <main className="dashboard-main">
            {loadingNews && articles.length === 0 && (
              <>
                <div className="featured-skeleton skeleton" />
                <section className="news-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </section>
              </>
            )}
            {!loadingNews && articles.length === 0 && !error && (
              <p className="empty-state">
                No articles match these filters. Try clearing them or check back shortly.
              </p>
            )}
            {featured && <FeaturedCard article={featured} />}
            {rest.length > 0 && (
              <section className="news-grid">
                {rest.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </section>
            )}
          </main>
          <TrendingSidebar topics={trending} loading={loadingTrending} onPick={pickTrending} />
        </div>
      </div>
    </>
  );
}
