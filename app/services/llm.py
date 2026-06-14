"""LLM provider abstraction.

This module exposes a single ``get_llm`` factory so the rest of the codebase
never depends on a specific vendor name. Swap providers by changing the
environment configuration (or this file) without touching callers.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Any

from app import config


@lru_cache(maxsize=1)
def get_llm() -> Any:
    """Return a LangChain chat model instance.

    Default implementation uses Google Gemini via langchain-google-genai, but
    the function returns a generic LangChain ``BaseChatModel`` so callers
    remain provider-agnostic.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model=config.LLM_MODEL,
        google_api_key=config.GOOGLE_API_KEY or None,
        temperature=0.3,
    )


@lru_cache(maxsize=1)
def get_embeddings() -> Any:
    """Return a LangChain embeddings instance backed by HuggingFace."""
    from langchain_huggingface import HuggingFaceEmbeddings

    return HuggingFaceEmbeddings(model_name=config.HF_EMBEDDING_MODEL)
