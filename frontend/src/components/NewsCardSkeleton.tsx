export default function NewsCardSkeleton() {
  return (
    <div className="news-card news-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="news-card__body">
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line short" />
        <div className="skeleton skeleton--line short" />
      </div>
    </div>
  );
}
