# 📰 Faxum Press - Automated Newsroom 

An AI-powered news aggregation platform that auto-detects trending topics worldwide, fetches
articles from multiple sources, embeds them into a vector store, and serves them on an
interactive React dashboard — **with no user input required to start reading the news**
(just like Google News or BBC).

> Stack: **FastAPI · LangChain · Google Gemini (swappable) · HuggingFace embeddings · ChromaDB · APScheduler · React + Vite + TypeScript**

---
## Preview  - Politics

![alt text](/pics/dashboard_1.PNG)

## Preview  - Techonology

![alt text](/pics/dashboard_3.PNG)




---

## ✨ Features

- 🔍 **Trend detection** via Serper API (worldwide, multi-category)
- 🌍 **Country-aware coverage** — pre-fetches news for **28 countries** (US, UK, India, Pakistan, Iran, Saudi Arabia, UAE, China, Japan, Germany, France, Brazil, …) using Serper's `gl`/`hl` params so the country filter actually has data
- 📰 **News aggregation** from multiple sources with **3-tier image extraction**
- 🤖 **Structured article generation** with LangChain + LLM (provider-agnostic)
- ✂️ **AI summarization** for quick reading
- 🧠 **RAG** — HuggingFace embeddings stored in ChromaDB; image URLs included in metadata
- ⏱️ **APScheduler** auto-refreshes trending + news every **30 minutes**
- 🖼️ **Editorial-grade dashboard** — sticky glass navbar, animated hero, featured article + card grid, dark footer
- 📄 **Multi-page app** — Dashboard, About, Contact (React Router)
- ❓ **Q&A box** — RAG-powered contextual answers with cited sources
- 📱 **Fully responsive** — mobile-first hamburger nav, fluid grids
- 🚫 **Zero axios** — uses native `fetch()` (frontend) and `httpx` (backend)

---

## 🏗️ Architecture

```
Trend Detection (Serper) ──► News Fetching ──► Image Pipeline (API → og:image → placeholder)
        │                                                       │
        └──► In-memory cache ◄── APScheduler (every 30 min) ◄───┘
                  │
                  ├──► FastAPI endpoints (/trending /news /filter /summarize /ask)
                  │
                  └──► RAG (HuggingFace → ChromaDB) ──► /ask (LangChain + LLM)
                                                          │
                                              React + Vite Dashboard
```

---

## 📁 Project Structure

```
nex-news/
├── app/                         # FastAPI backend
│   ├── main.py                  # App entrypoint, CORS, lifespan
│   ├── config.py                # Env-driven configuration
│   ├── routes/                  # API endpoints
│   │   ├── trending.py          # GET  /trending
│   │   ├── news.py              # GET  /news
│   │   ├── filter.py            # POST /filter
│   │   ├── summarize.py         # POST /summarize
│   │   └── ask.py               # POST /ask  (RAG)
│   ├── services/
│   │   ├── trend.py             # Serper trending
│   │   ├── news.py              # News + 3-tier image extraction
│   │   ├── rag.py               # HF embeddings + ChromaDB
│   │   ├── generator.py         # Article generation
│   │   ├── summarizer.py        # Summaries
│   │   ├── llm.py               # Provider-agnostic LLM/embeddings factory
│   │   ├── store.py             # In-memory cache
│   │   └── scheduler.py         # APScheduler 30-min refresh
│   └── models/schemas.py        # Pydantic schemas
│
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── App.tsx              # Auto-load + 30-min interval refresh
│   │   ├── api.ts               # fetch() wrapper (no axios)
│   │   ├── types.ts
│   │   ├── components/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsCardSkeleton.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TrendingSidebar.tsx
│   │   │   └── AskBox.tsx
│   │   └── styles/index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── vector_db/                   # ChromaDB persistent store (created at runtime)
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚙️ Setup

### 1. Clone & install backend

```bash
git clone <repo-url>
cd nex-news
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
cp .env.example .env       # macOS / Linux
copy .env.example .env     # Windows
```

Fill in:

- `SERPER_API_KEY` — get a free key at <https://serper.dev>
- `GOOGLE_API_KEY` — Google AI Studio key at <https://aistudio.google.com/apikey>
- Optional: `LLM_MODEL`, `HF_EMBEDDING_MODEL`, `REFRESH_INTERVAL_MINUTES`

### 3. Run the backend

```bash
uvicorn app.main:app --reload
# Server: http://127.0.0.1:8000
# Docs:   http://127.0.0.1:8000/docs
```

On startup the scheduler kicks off an initial fetch + embed cycle in the background and then
re-runs it every **30 minutes**.

### 4. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env       # or: copy .env.example .env
npm run dev
# Dashboard: http://localhost:5173
```

The dashboard auto-loads trending topics and news cards on mount — **no user query required**
— and re-fetches automatically every 30 minutes.

---

## 📡 API Reference

| Method | Path         | Description                                                        |
| ------ | ------------ | ------------------------------------------------------------------ |
| GET    | `/trending`  | Current worldwide trending topics                                  |
| GET    | `/news`      | All auto-fetched news articles (cached)                            |
| GET    | `/meta`      | Supported categories + countries for the filter UI                 |
| POST   | `/filter`    | Filter by `category`, `country`, `keyword`, `date_from`, `date_to` |
| POST   | `/summarize` | `{ title?, content, url? }` → AI summary                           |
| POST   | `/ask`       | `{ query, top_k? }` → RAG answer + sources                         |

### 🖥️ Frontend pages

| Route      | Description                                             |
| ---------- | ------------------------------------------------------- |
| `/`        | Dashboard — auto-loading news + trending + filter + Ask |
| `/about`   | About the project, how it works, tech stack             |
| `/contact` | Contact page with form (UI) and team channels           |

Example:

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"Latest AI news this week"}'
```

---

## 🖼️ Image Extraction Pipeline

`app/services/news.py → resolve_image()` follows this priority:

1. **Provider field** — `imageUrl`, `urlToImage`, `image`, `thumbnail`, `thumbnailUrl`
2. **OpenGraph scrape** — fetches the article URL and reads `<meta property="og:image">` (also `twitter:image`)
3. **Placeholder** — `DEFAULT_NEWS_IMAGE` from `.env`

The resolved `image_url` is **stored in ChromaDB metadata** alongside `title`, `summary`, `url`,
`source`, `category`, `country`, and `published_at`, so RAG handles reasoning while the
frontend gets rich media for cards.

---

## 🔁 Swapping the LLM Provider

The codebase never hard-references the vendor name in business logic. Edit `app/services/llm.py`
(`get_llm()` / `get_embeddings()`) to swap to any LangChain-compatible chat model — no other
files need changes.

---

## ✅ Verification Checklist

- [x] All 5 API endpoints implemented (`/trending`, `/news`, `/filter`, `/summarize`, `/ask`)
- [x] APScheduler refreshes every 30 minutes + on startup
- [x] 3-tier image pipeline (API field → og:image → placeholder)
- [x] `image_url` stored in ChromaDB metadata
- [x] `.env.example` provided with all required keys
- [x] `requirements.txt` pins every dependency
- [x] Frontend auto-loads news on mount (no query required)
- [x] **Zero axios** — `fetch()` on the frontend, `httpx` on the backend

---

## 📄 License

Educational project.
