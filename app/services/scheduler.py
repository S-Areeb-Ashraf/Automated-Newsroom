"""Background refresh job — runs on startup and on a recurring interval."""
from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app import config
from app.services import news as news_service
from app.services import rag as rag_service
from app.services import trend as trend_service
from app.services.store import store

logger = logging.getLogger(__name__)

_scheduler: AsyncIOScheduler | None = None


async def refresh_all() -> None:
    """Re-fetch trending topics + news articles and re-embed into ChromaDB."""
    logger.info("[scheduler] refreshing trending topics and news...")
    try:
        topics = await trend_service.fetch_trending_topics()
        store.set_trending(topics)
        logger.info("[scheduler] %d trending topics cached", len(topics))
    except Exception as exc:  # noqa: BLE001
        logger.exception("[scheduler] trend fetch failed: %s", exc)
        topics = store.get_trending()

    try:
        articles = await news_service.fetch_news(trending=topics)
        store.set_articles(articles)
        logger.info("[scheduler] %d articles cached", len(articles))
    except Exception as exc:  # noqa: BLE001
        logger.exception("[scheduler] news fetch failed: %s", exc)
        articles = []

    if articles:
        try:
            count = rag_service.upsert_articles(articles)
            logger.info("[scheduler] %d articles embedded into vector store", count)
        except Exception as exc:  # noqa: BLE001
            logger.exception("[scheduler] vector upsert failed: %s", exc)


def start_scheduler() -> AsyncIOScheduler:
    global _scheduler
    if _scheduler and _scheduler.running:
        return _scheduler
    _scheduler = AsyncIOScheduler()
    _scheduler.add_job(
        refresh_all,
        trigger=IntervalTrigger(minutes=config.REFRESH_INTERVAL_MINUTES),
        id="refresh_all",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    _scheduler.start()
    logger.info(
        "[scheduler] started — refresh every %d minute(s)",
        config.REFRESH_INTERVAL_MINUTES,
    )
    return _scheduler


def shutdown_scheduler() -> None:
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        _scheduler = None
