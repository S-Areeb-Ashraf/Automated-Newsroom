"""POST /filter — filter cached news by category, country, keyword, and date range."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter

from app.models.schemas import Article, FilterRequest, NewsResponse
from app.services.store import store

router = APIRouter(tags=["filter"])


def _parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue
    return None


def _article_date(article: Article) -> Optional[datetime]:
    raw = article.published_at or ""
    return _parse_date(raw)


@router.post("/filter", response_model=NewsResponse)
async def filter_news(req: FilterRequest) -> NewsResponse:
    articles: List[Article] = store.get_articles()
    keyword = (req.keyword or "").lower().strip()
    category = (req.category or "").lower().strip()
    country = (req.country or "").lower().strip()
    date_from = _parse_date(req.date_from)
    date_to = _parse_date(req.date_to)

    def matches(art: Article) -> bool:
        if category and (art.category or "").lower() != category:
            return False
        if country and (art.country or "").lower() != country:
            return False
        if keyword:
            blob = f"{art.title} {art.summary} {art.source}".lower()
            if keyword not in blob:
                return False
        if date_from or date_to:
            art_dt = _article_date(art)
            if art_dt is None:
                # Keep undated items only when no date filter is requested.
                return False
            if date_from and art_dt < date_from:
                return False
            if date_to and art_dt > date_to:
                return False
        return True

    filtered = [a for a in articles if matches(a)]
    return NewsResponse(count=len(filtered), articles=filtered)
