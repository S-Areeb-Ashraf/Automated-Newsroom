"""Structured article generation via LangChain + the configured LLM."""
from __future__ import annotations

import logging
from typing import Dict

from langchain_core.prompts import ChatPromptTemplate

from app.services.llm import get_llm

logger = logging.getLogger(__name__)

_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a professional newsroom editor. Produce well-structured, "
            "neutral, factual news articles. Always include a headline, a one-line "
            "deck/sub-headline, and 3-5 short paragraphs. Do not fabricate facts; "
            "if information is missing, state that clearly.",
        ),
        (
            "human",
            "Topic: {topic}\n\nSource notes:\n{notes}\n\n"
            "Write the article in plain text with this structure:\n"
            "HEADLINE: <headline>\nDECK: <one line>\n\n<body paragraphs>",
        ),
    ]
)


async def generate_article(topic: str, notes: str = "") -> Dict[str, str]:
    """Generate a structured news article for the given topic."""
    try:
        chain = _PROMPT | get_llm()
        result = await chain.ainvoke({"topic": topic, "notes": notes or "(no extra notes)"})
        text = getattr(result, "content", str(result)).strip()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Article generation failed: %s", exc)
        return {"headline": topic, "deck": "", "body": ""}

    headline, deck, body = topic, "", text
    for line in text.splitlines():
        if line.lower().startswith("headline:"):
            headline = line.split(":", 1)[1].strip()
        elif line.lower().startswith("deck:"):
            deck = line.split(":", 1)[1].strip()
    if "\n\n" in text:
        body = text.split("\n\n", 1)[1].strip()
    return {"headline": headline, "deck": deck, "body": body}
