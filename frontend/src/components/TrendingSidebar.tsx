import type { TrendingTopic } from "../types";

interface Props {
  topics: TrendingTopic[];
  loading: boolean;
  onPick: (query: string) => void;
}

export default function TrendingSidebar({ topics, loading, onPick }: Props) {
  return (
    <aside className="trending">
      <h2 className="trending__title"> Trending now</h2>
      {loading && topics.length === 0 && (
        <ul className="trending__list">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="trending__item">
              <div className="skeleton skeleton--line" />
            </li>
          ))}
        </ul>
      )}
      {!loading && topics.length === 0 && (
        <p className="trending__empty">No trending topics yet.</p>
      )}
      <ul className="trending__list">
        {topics.map((t, idx) => (
          <li key={`${t.title}-${idx}`} className="trending__item">
            <button
              type="button"
              className="trending__btn"
              onClick={() => onPick(t.query)}
              title="Use as keyword filter"
            >
              <span className="trending__index">{idx + 1}</span>
              <span className="trending__text">
                <span className="trending__topic">{t.title}</span>
                {t.category && <span className="trending__cat">{t.category}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
