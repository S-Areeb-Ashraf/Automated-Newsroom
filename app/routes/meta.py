"""GET /meta — supported categories + countries for the dashboard filters."""
from __future__ import annotations

from fastapi import APIRouter

from app.services.constants import CATEGORIES, COUNTRIES

router = APIRouter(tags=["meta"])


@router.get("/meta")
async def get_meta() -> dict:
    return {
        "categories": list(CATEGORIES),
        "countries": [{"code": code, "name": name} for code, name, _ in COUNTRIES],
    }
