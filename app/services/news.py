"""News collection + image extraction pipeline.

Image priority (per README) — provider-first for speed:
  1. Provider-supplied image field (``imageUrl`` / ``urlToImage`` / ``image`` /
     ``thumbnail``). Used immediately so the dashboard cold-start is fast and
     not blocked on ~200 extra HTTP scrapes.
  2. OpenGraph ``og:image`` scrape from the article page — only when the
     provider didn't supply an image (rare).
  3. Default placeholder image.
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
from typing import Any, Dict, Iterable, List, Optional

import httpx
from bs4 import BeautifulSoup

from app import config
from app.models.schemas import Article, TrendingTopic
from app.services.constants import COUNTRIES

logger = logging.getLogger(__name__)

SERPER_NEWS_URL = "https://google.serper.dev/news"

DEFAULT_CATEGORIES = [
    ("World", "world news today"),
    ("Technology", "technology news"),
    ("Business", "business news"),
    ("Sports", "sports news"),
    ("Entertainment", "entertainment news"),
    ("Science", "science news"),
    ("Health", "health news"),
    ("Politics", "politics news"),
]


def _article_id(url: str, title: str) -> str:
    return hashlib.sha1(f"{url}|{title}".encode("utf-8", errors="ignore")).hexdigest()[:16]


async def _serper_news(
    client: httpx.AsyncClient,
    query: str,
    num: int = 10,
    gl: Optional[str] = None,
    hl: Optional[str] = None,
) -> List[dict]:
    if not config.SERPER_API_KEY:
        logger.warning("SERPER_API_KEY not set — skipping news fetch for %s", query)
        return []
    headers = {"X-API-KEY": config.SERPER_API_KEY, "Content-Type": "application/json"}
    payload: Dict[str, Any] = {"q": query, "num": num}
    if gl:
        payload["gl"] = gl
    if hl:
        payload["hl"] = hl
    try:
        resp = await client.post(
            SERPER_NEWS_URL,
            json=payload,
            headers=headers,
            timeout=20.0,
        )
        resp.raise_for_status()
        return (resp.json() or {}).get("news", []) or []
    except httpx.HTTPError as exc:
        logger.error("Serper news fetch failed (%s): %s", query, exc)
        return []


async def extract_og_image(client: httpx.AsyncClient, url: str) -> Optional[str]:
    """Scrape an article page and return its ``og:image`` content if present.

    Uses a tight 5s timeout so a single slow publisher never blocks the
    cold-start refresh.
    """
    if not url:
        return None
    try:
        resp = await client.get(
            url,
            timeout=5.0,
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0 (NewsroomBot/1.0)"},
        )
        if resp.status_code >= 400 or not resp.text:
            return None
        soup = BeautifulSoup(resp.text, "lxml")
        for prop in ("og:image", "og:image:url", "twitter:image"):
            tag = soup.find("meta", attrs={"property": prop}) or soup.find(
                "meta", attrs={"name": prop}
            )
            if tag and tag.get("content"):
                return tag["content"].strip()
    except (httpx.HTTPError, ValueError) as exc:
        logger.debug("og:image scrape failed for %s: %s", url, exc)
    return None


async def resolve_image(client: httpx.AsyncClient, raw: Dict[str, Any]) -> str:
    """Apply the 3-tier image priority chain and always return a usable URL.

    Provider-first keeps cold-start fast: most Serper results already include
    an ``imageUrl`` thumbnail we can render immediately. We only fall back to
    the (slower) ``og:image`` scrape when the provider didn't supply anything.
    """
    # Tier 1 — provider-supplied fields (covers Serper + common NewsAPI shapes).
    for key in ("imageUrl", "urlToImage", "image", "thumbnail", "thumbnailUrl"):
        value = raw.get(key)
        if isinstance(value, str) and value.startswith("http"):
            return value

    # Tier 2 — OpenGraph scrape fallback (only when provider has no image).
    og = await extract_og_image(client, raw.get("link") or raw.get("url") or "")
    if og:
        return og

    # Tier 3 — placeholder.
    return config.DEFAULT_NEWS_IMAGE


async def _build_article(
    client: httpx.AsyncClient, raw: dict, category: str, country: Optional[str]
) -> Optional[Article]:
    url = raw.get("link") or raw.get("url")
    title = (raw.get("title") or "").strip()
    if not url or not title:
        return None
    image_url = await resolve_image(client, raw)
    return Article(
        id=_article_id(url, title),
        title=title,
        summary=(raw.get("snippet") or raw.get("description") or "").strip(),
        url=url,
        source=(raw.get("source") or "").strip(),
        image_url=image_url,
        published_at=raw.get("date") or raw.get("publishedAt"),
        category=category,
        country=country,
    )


async def fetch_news(
    trending: Optional[Iterable[TrendingTopic]] = None,
    per_query: int = 8,
    per_country: int = 5,
) -> List[Article]:
    """Fetch articles for default categories, every supported country, and trending topics.

    Each article is tagged with a ``country`` (when fetched via Serper's ``gl``
    parameter) so the dashboard's country filter has real data to filter on.
    """
    # (category, query, country_name, gl, hl)
    queries: List[tuple] = [
        (cat, q, None, None, None) for cat, q in DEFAULT_CATEGORIES
    ]
    for gl, name, hl in COUNTRIES:
        queries.append(("World", f"top news {name}", name, gl, hl))
    if trending:
        for topic in trending:
            queries.append(
                (topic.category or "Trending", topic.query, topic.country, None, None)
            )

    articles: List[Article] = []
    seen_ids: set = set()

    async with httpx.AsyncClient() as client:
        for category, query, country, gl, hl in queries:
            num = per_country if gl else per_query
            raw_items = await _serper_news(client, query, num=num, gl=gl, hl=hl)
            tasks = [
                _build_article(client, raw, category, country) for raw in raw_items
            ]
            built = await asyncio.gather(*tasks, return_exceptions=False)
            for art in built:
                if art and art.id not in seen_ids:
                    seen_ids.add(art.id)
                    articles.append(art)
    return articles
