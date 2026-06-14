"""Short-form summarization via the configured LLM."""
from __future__ import annotations

import logging
from typing import Optional

from langchain_core.prompts import ChatPromptTemplate

from app.services.llm import get_llm

logger = logging.getLogger(__name__)

_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You write concise, neutral news summaries (2-3 sentences, ~60 words). "
            "Never invent facts beyond the provided text.",
        ),
        (
            "human",
            "Title: {title}\n\nContent:\n{content}\n\nWrite the summary:",
        ),
    ]
)


async def summarize(content: str, title: Optional[str] = None) -> str:
    if not content or not content.strip():
        return ""
    try:
        chain = _PROMPT | get_llm()
        result = await chain.ainvoke({"title": title or "(untitled)", "content": content})
        return getattr(result, "content", str(result)).strip()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Summarization failed: %s", exc)
        return ""
