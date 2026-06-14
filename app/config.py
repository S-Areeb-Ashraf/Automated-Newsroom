"""Centralized configuration loaded from environment variables."""
from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()


def _get(name: str, default: str = "") -> str:
    return os.getenv(name, default) or default


# LLM / embeddings
GOOGLE_API_KEY = _get("GOOGLE_API_KEY")
# LLM_MODEL = _get("LLM_MODEL", "gemini-1.5-flash")
LLM_MODEL = _get("LLM_MODEL", "gemini-2.5-flash")
HF_EMBEDDING_MODEL = _get("HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

# Data sources
SERPER_API_KEY = _get("SERPER_API_KEY")

# Scheduler
REFRESH_INTERVAL_MINUTES = int(_get("REFRESH_INTERVAL_MINUTES", "30"))

# Storage
CHROMA_DIR = _get("CHROMA_DIR", "./vector_db")
DEFAULT_NEWS_IMAGE = _get(
    "DEFAULT_NEWS_IMAGE",
    "https://placehold.co/1600x900/0b1220/e2e8f0?text=Faxum+Press",
)

# CORS
FRONTEND_ORIGIN = _get("FRONTEND_ORIGIN", "http://localhost:5173")
