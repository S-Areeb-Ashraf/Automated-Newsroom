import type { Article } from "../types";

const PLACEHOLDER = "https://placehold.co/1920x1080/0b1220/e2e8f0?text=Faxum+Press";

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

export default function FeaturedCard({ article }: Props) {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
  };

  return (
    <article className="featured">
      <a className="featured__media" href={article.url} target="_blank" rel="noreferrer">
        <img
          src={article.image_url || PLACEHOLDER}
          alt={article.title}
          onError={handleImgError}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="featured__overlay" />
        {article.category && (
          <span className="badge badge--accent featured__badge">{article.category}</span>
        )}
      </a>
      <div className="featured__body">
        <div className="featured__meta">
          {article.source && <span className="featured__source">{article.source}</span>}
          {article.published_at && <span>·</span>}
          {article.published_at && <span>{formatDate(article.published_at)}</span>}
          {article.country && (
            <>
              <span>·</span>
              <span className="badge badge--soft">{article.country}</span>
            </>
          )}
        </div>
        <h2 className="featured__title">
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h2>
        {article.summary && <p className="featured__summary">{article.summary}</p>}
        <a className="btn btn--primary featured__cta" href={article.url} target="_blank" rel="noreferrer">
          Read full story →
        </a>
      </div>
    </article>
  );
}
