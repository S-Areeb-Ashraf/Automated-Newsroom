"""POST /summarize — generate a short AI summary for arbitrary article content."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.schemas import SummarizeRequest, SummarizeResponse
from app.services.summarizer import summarize

router = APIRouter(tags=["summarize"])


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_endpoint(req: SummarizeRequest) -> SummarizeResponse:
    if not (req.content or "").strip():
        raise HTTPException(status_code=400, detail="content is required")
    summary = await summarize(req.content, title=req.title)
    return SummarizeResponse(summary=summary)
