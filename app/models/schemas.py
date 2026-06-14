"""Pydantic schemas used across the API layer."""
from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class TrendingTopic(BaseModel):
    title: str
    query: str
    country: Optional[str] = None
    category: Optional[str] = None


class Article(BaseModel):
    id: str
    title: str
    summary: str = ""
    url: str
    source: str = ""
    image_url: str = ""
    published_at: Optional[str] = None
    category: Optional[str] = None
    country: Optional[str] = None


class FilterRequest(BaseModel):
    category: Optional[str] = None
    country: Optional[str] = None
    keyword: Optional[str] = None
    date_from: Optional[str] = Field(default=None, description="ISO date (YYYY-MM-DD)")
    date_to: Optional[str] = Field(default=None, description="ISO date (YYYY-MM-DD)")


class SummarizeRequest(BaseModel):
    title: Optional[str] = None
    content: str
    url: Optional[str] = None


class SummarizeResponse(BaseModel):
    summary: str


class AskRequest(BaseModel):
    query: str
    top_k: int = 4


class AskSource(BaseModel):
    title: str
    url: str
    source: str = ""
    image_url: str = ""


class AskResponse(BaseModel):
    answer: str
    sources: List[AskSource] = []


class NewsResponse(BaseModel):
    count: int
    articles: List[Article]


class TrendingResponse(BaseModel):
    count: int
    topics: List[TrendingTopic]
