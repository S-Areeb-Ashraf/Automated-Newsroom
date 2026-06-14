"""FastAPI application entrypoint for the Automated Newsroom."""
from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.routes import ask as ask_route
from app.routes import filter as filter_route
from app.routes import meta as meta_route
from app.routes import news as news_route
from app.routes import summarize as summarize_route
from app.routes import trending as trending_route
from app.services import scheduler as scheduler_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Kick off an initial refresh in the background so the API is usable
    # immediately while the first crawl completes asynchronously.
    asyncio.create_task(scheduler_service.refresh_all())
    scheduler_service.start_scheduler()
    try:
        yield
    finally:
        scheduler_service.shutdown_scheduler()


app = FastAPI(
    title="Automated Newsroom",
    description="LangChain + FastAPI + RAG powered news aggregator.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
async def root() -> dict:
    return {
        "name": "Automated Newsroom API",
        "status": "ok",
        "endpoints": ["/trending", "/news", "/filter", "/summarize", "/ask"],
    }


app.include_router(trending_route.router)
app.include_router(news_route.router)
app.include_router(filter_route.router)
app.include_router(summarize_route.router)
app.include_router(ask_route.router)
app.include_router(meta_route.router)
