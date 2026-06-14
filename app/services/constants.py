"""Static lists shared across services (countries, categories).

Keep this file in sync with ``frontend/src/constants/countries.ts``.

The Serper API supports the standard Google ``gl`` (geolocation country code)
and ``hl`` (UI language) parameters. We use them to fetch country-specific
top news so the dashboard's country filter actually has content to filter on.
"""
from __future__ import annotations

# (ISO code, Display name, language code)
COUNTRIES: list[tuple[str, str, str]] = [
    ("us", "United States", "en"),
    ("gb", "United Kingdom", "en"),
    ("ca", "Canada", "en"),
    ("au", "Australia", "en"),
    ("in", "India", "en"),
    ("pk", "Pakistan", "en"),
    ("bd", "Bangladesh", "en"),
    ("ir", "Iran", "en"),
    ("sa", "Saudi Arabia", "en"),
    ("ae", "United Arab Emirates", "en"),
    ("cn", "China", "en"),
    ("jp", "Japan", "en"),
    ("kr", "South Korea", "en"),
    ("de", "Germany", "de"),
    ("fr", "France", "fr"),
    ("it", "Italy", "it"),
    ("es", "Spain", "es"),
    ("ru", "Russia", "ru"),
    ("tr", "Turkey", "tr"),
    ("br", "Brazil", "pt"),
    ("mx", "Mexico", "es"),
    ("za", "South Africa", "en"),
    ("eg", "Egypt", "en"),
    ("ng", "Nigeria", "en"),
    ("id", "Indonesia", "id"),
    ("sg", "Singapore", "en"),
    ("nl", "Netherlands", "nl"),
    ("se", "Sweden", "sv"),
]

CATEGORIES: list[str] = [
    "World",
    "Technology",
    "Business",
    "Sports",
    "Entertainment",
    "Science",
    "Health",
    "Politics",
]
