"""In-memory cache of the most recent trending topics + news articles.

The dashboard auto-loads from this cache so users see content instantly without
needing to enter a query. The cache is refreshed in the background by the
APScheduler job in :mod:`app.services.scheduler`.
"""
from __future__ import annotations

import threading
from datetime import datetime, timezone
from typing import List, Optional

from app.models.schemas import Article, TrendingTopic


class _NewsStore:
    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._articles: List[Article] = []
        self._trending: List[TrendingTopic] = []
        self._last_refresh: Optional[datetime] = None

    def set_articles(self, articles: List[Article]) -> None:
        with self._lock:
            self._articles = list(articles)
            self._last_refresh = datetime.now(timezone.utc)

    def set_trending(self, topics: List[TrendingTopic]) -> None:
        with self._lock:
            self._trending = list(topics)

    def get_articles(self) -> List[Article]:
        with self._lock:
            return list(self._articles)

    def get_trending(self) -> List[TrendingTopic]:
        with self._lock:
            return list(self._trending)

    @property
    def last_refresh(self) -> Optional[datetime]:
        with self._lock:
            return self._last_refresh


store = _NewsStore()
