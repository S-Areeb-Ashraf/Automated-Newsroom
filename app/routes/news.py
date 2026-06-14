"""GET /news — returns all auto-fetched news articles from the in-memory cache."""
from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import NewsResponse
from app.services import news as news_service
from app.services import rag as rag_service
from app.services.store import store

router = APIRouter(tags=["news"])


@router.get("/news", response_model=NewsResponse)
async def get_news() -> NewsResponse:
    articles = store.get_articles()
    if not articles:
        # Cold-start fallback so the dashboard never shows an empty state.
        articles = await news_service.fetch_news(trending=store.get_trending())
        store.set_articles(articles)
        if articles:
            rag_service.upsert_articles(articles)
    return NewsResponse(count=len(articles), articles=articles)
