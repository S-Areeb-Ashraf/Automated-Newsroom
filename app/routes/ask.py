"""POST /ask — RAG: retrieve relevant articles, then ask the LLM for an answer."""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from langchain_core.prompts import ChatPromptTemplate

from app.models.schemas import AskRequest, AskResponse, AskSource
from app.services import rag as rag_service
from app.services.llm import get_llm

logger = logging.getLogger(__name__)

router = APIRouter(tags=["ask"])


_RAG_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful newsroom assistant. Answer the user's question using "
            "ONLY the provided context articles. If the answer is not in the context, "
            "say you don't have enough information. Cite article titles inline.",
        ),
        (
            "human",
            "Question: {question}\n\nContext articles:\n{context}\n\nAnswer:",
        ),
    ]
)


def _format_context(hits: list[dict]) -> str:
    blocks = []
    for i, hit in enumerate(hits, start=1):
        meta = hit.get("metadata") or {}
        blocks.append(
            f"[{i}] {meta.get('title', '')}\n"
            f"Source: {meta.get('source', '')} | URL: {meta.get('url', '')}\n"
            f"{hit.get('document', '')}"
        )
    return "\n\n".join(blocks) if blocks else "(no relevant articles found)"


@router.post("/ask", response_model=AskResponse)
async def ask(req: AskRequest) -> AskResponse:
    query = (req.query or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="query is required")

    hits = rag_service.query_articles(query, top_k=req.top_k)
    context = _format_context(hits)

    try:
        chain = _RAG_PROMPT | get_llm()
        result = await chain.ainvoke({"question": query, "context": context})
        answer = getattr(result, "content", str(result)).strip()
    except Exception as exc:  # noqa: BLE001
        logger.exception("RAG answer generation failed: %s", exc)
        answer = "Sorry, I couldn't generate an answer right now."

    sources = [
        AskSource(
            title=(hit.get("metadata") or {}).get("title", ""),
            url=(hit.get("metadata") or {}).get("url", ""),
            source=(hit.get("metadata") or {}).get("source", ""),
            image_url=(hit.get("metadata") or {}).get("image_url", ""),
        )
        for hit in hits
    ]
    return AskResponse(answer=answer, sources=sources)
