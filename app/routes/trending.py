"""GET /trending — returns the cached worldwide trending topics."""
from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import TrendingResponse
from app.services import trend as trend_service
from app.services.store import store

router = APIRouter(tags=["trending"])


@router.get("/trending", response_model=TrendingResponse)
async def get_trending() -> TrendingResponse:
    topics = store.get_trending()
    if not topics:
        topics = await trend_service.fetch_trending_topics()
        store.set_trending(topics)
    return TrendingResponse(count=len(topics), topics=topics)
