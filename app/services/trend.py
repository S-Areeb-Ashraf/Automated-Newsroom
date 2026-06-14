"""Trend detection via Serper API.

Queries Serper's search endpoint to derive trending topics from around the
world. The results are normalized into :class:`TrendingTopic` instances.
"""
from __future__ import annotations

import logging
from typing import List

import httpx

from app import config
from app.models.schemas import TrendingTopic

logger = logging.getLogger(__name__)

SERPER_SEARCH_URL = "https://google.serper.dev/search"
SERPER_NEWS_URL = "https://google.serper.dev/news"

# Categories used to gather a diverse global trending list.
DEFAULT_TRENDING_QUERIES = [
    ("Top world news today", "World", None),
    ("Trending technology news", "Technology", None),
    ("Trending business news", "Business", None),
    ("Trending sports news", "Sports", None),
    ("Trending entertainment news", "Entertainment", None),
    ("Trending science news", "Science", None),
    ("Trending health news", "Health", None),
    ("Trending politics news", "Politics", None),
]


async def _serper_post(client: httpx.AsyncClient, url: str, payload: dict) -> dict:
    if not config.SERPER_API_KEY:
        logger.warning("SERPER_API_KEY not set — returning empty payload")
        return {}
    headers = {
        "X-API-KEY": config.SERPER_API_KEY,
        "Content-Type": "application/json",
    }
    try:
        resp = await client.post(url, json=payload, headers=headers, timeout=20.0)
        resp.raise_for_status()
        return resp.json()
    except httpx.HTTPError as exc:
        logger.error("Serper request failed for %s: %s", url, exc)
        return {}


async def fetch_trending_topics(limit: int = 24) -> List[TrendingTopic]:
    """Fetch a diverse set of trending topics."""
    topics: List[TrendingTopic] = []
    seen = set()

    async with httpx.AsyncClient() as client:
        for query, category, country in DEFAULT_TRENDING_QUERIES:
            payload: dict = {"q": query, "num": 5}
            data = await _serper_post(client, SERPER_NEWS_URL, payload)
            for item in (data.get("news") or [])[:5]:
                title = (item.get("title") or "").strip()
                if not title or title.lower() in seen:
                    continue
                seen.add(title.lower())
                topics.append(
                    TrendingTopic(
                        title=title,
                        query=title,
                        country=country,
                        category=category,
                    )
                )
                if len(topics) >= limit:
                    return topics
    return topics
