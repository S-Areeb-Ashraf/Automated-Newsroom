"""RAG layer: embed articles with HuggingFace and persist them in ChromaDB."""
from __future__ import annotations

import logging
import threading
from typing import Iterable, List, Optional

import chromadb
from chromadb.config import Settings

from app import config
from app.models.schemas import Article
from app.services.llm import get_embeddings

logger = logging.getLogger(__name__)

_COLLECTION_NAME = "news_articles"
_lock = threading.Lock()
_client: Optional[chromadb.api.ClientAPI] = None
_collection = None


def _ensure_collection():
    global _client, _collection
    with _lock:
        if _collection is not None:
            return _collection
        _client = chromadb.PersistentClient(
            path=config.CHROMA_DIR,
            settings=Settings(anonymized_telemetry=False),
        )
        _collection = _client.get_or_create_collection(name=_COLLECTION_NAME)
        return _collection


def _embed_texts(texts: List[str]) -> List[List[float]]:
    return get_embeddings().embed_documents(texts)


def _embed_query(text: str) -> List[float]:
    return get_embeddings().embed_query(text)


def upsert_articles(articles: Iterable[Article]) -> int:
    """Embed and upsert articles. ``image_url`` is stored in metadata per README."""
    articles = list(articles)
    if not articles:
        return 0

    collection = _ensure_collection()
    ids: List[str] = []
    docs: List[str] = []
    metadatas: List[dict] = []

    for art in articles:
        ids.append(art.id)
        docs.append(f"{art.title}\n\n{art.summary}")
        metadatas.append(
            {
                "title": art.title,
                "summary": art.summary,
                "url": art.url,
                "source": art.source,
                "image_url": art.image_url,
                "category": art.category or "",
                "country": art.country or "",
                "published_at": art.published_at or "",
            }
        )

    try:
        embeddings = _embed_texts(docs)
        collection.upsert(
            ids=ids,
            documents=docs,
            metadatas=metadatas,
            embeddings=embeddings,
        )
    except Exception as exc:  # noqa: BLE001 — embedding/vector errors are best-effort
        logger.exception("Failed to upsert into vector store: %s", exc)
        return 0
    return len(ids)


def query_articles(query: str, top_k: int = 4) -> List[dict]:
    """Return the top-k most similar article metadata + document chunks."""
    collection = _ensure_collection()
    try:
        embedding = _embed_query(query)
        result = collection.query(
            query_embeddings=[embedding],
            n_results=max(1, top_k),
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Vector query failed: %s", exc)
        return []

    docs = (result.get("documents") or [[]])[0]
    metas = (result.get("metadatas") or [[]])[0]
    hits: List[dict] = []
    for doc, meta in zip(docs, metas):
        hits.append({"document": doc, "metadata": meta or {}})
    return hits
