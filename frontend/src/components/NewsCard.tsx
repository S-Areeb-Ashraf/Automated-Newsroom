import type { Article } from "../types";

const PLACEHOLDER =
  "https://placehold.co/1600x900/0b1220/e2e8f0?text=Faxum+Press";

interface Props {
  article: Article;
}

function formatDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsCard({ article }: Props) {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
  };

  return (
    <article className="news-card">
      <a href={article.url} target="_blank" rel="noreferrer" className="news-card__image-link">
        <img
          src={article.image_url || PLACEHOLDER}
          alt={article.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="news-card__image"
        />
        {article.category && (
          <span className="news-card__category">{article.category}</span>
        )}
      </a>
      <div className="news-card__body">
        <h3 className="news-card__title">
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        {article.summary && (
          <p className="news-card__summary">{article.summary}</p>
        )}
        <div className="news-card__meta">
          <span className="news-card__source">{article.source || "Unknown source"}</span>
          {article.published_at && (
            <span className="news-card__date">{formatDate(article.published_at)}</span>
          )}
          {article.country && (
            <span className="news-card__tag">{article.country}</span>
          )}
        </div>
        <a
          className="news-card__read-more"
          href={article.url}
          target="_blank"
          rel="noreferrer"
        >
          Read more →
        </a>
      </div>
    </article>
  );
}
