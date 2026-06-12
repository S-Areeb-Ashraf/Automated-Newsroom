interface Props {
  lastRefresh: Date | null;
}

function timeAgo(date: Date | null): string {
  if (!date) return "Loading…";
  const diff = Math.max(0, Date.now() - date.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
}

export default function Hero({ lastRefresh }: Props) {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden>
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__orb hero__orb--3" />
      </div>
      <div className="container hero__inner">
        <span className="hero__eyebrow">
          <span className="hero__pulse" /> Live · auto-refreshing every 30 min
        </span>
        <h1 className="hero__title">
          The world's news, <span className="hero__accent">curated by AI.</span>
        </h1>
        <p className="hero__subtitle">
          Trending topics from every continent, summarized and searchable through
          a Retrieval-Augmented Q&amp;A engine — no query required to start reading.
        </p>
        <div className="hero__meta">
          <span className="hero__chip">🌍 28 countries</span>
          <span className="hero__chip">🧠 RAG search</span>
          <span className="hero__chip">⏱️ Updated {timeAgo(lastRefresh)}</span>
        </div>
      </div>
    </section>
  );
}
