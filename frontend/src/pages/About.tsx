export default function About() {
  const steps = [
    { n: "01", t: "Trend Detection", d: "We poll the Serper API across categories and 28 countries to find what the world is reading right now." },
    { n: "02", t: "News Aggregation", d: "Articles are normalized and enriched with a 3-tier image pipeline (provider field → og:image → placeholder)." },
    { n: "03", t: "Vector Embedding", d: "Each article is embedded with HuggingFace sentence-transformers and persisted in ChromaDB with full metadata." },
    { n: "04", t: "Summarization", d: "An LLM produces a short, neutral 2–3 sentence summary so you can skim 100 stories in minutes." },
    { n: "05", t: "RAG Q&A", d: "Ask any question; we retrieve the most relevant articles and the LLM answers using only that evidence — with citations." },
    { n: "06", t: "Auto-Refresh", d: "An APScheduler job re-runs the pipeline every 30 minutes so the dashboard is always fresh — no user action required." },
  ];

  const stack = [
    ["Backend", ["FastAPI", "httpx", "APScheduler", "Pydantic"]],
    ["AI / LLM", ["LangChain", "Provider-agnostic LLM", "HuggingFace"]],
    ["Data & RAG", ["Serper API", "BeautifulSoup", "ChromaDB"]],
    ["Frontend", ["React", "Vite", "TypeScript", "Fetch API"]],
  ] as const;

  return (
    <main className="page page--about">
      <section className="page__hero">
        <div className="container">
          <span className="hero__eyebrow">About</span>
          <h1 className="page__title">A self-updating newsroom, powered by AI.</h1>
          <p className="page__lede">
            Faxum Press collects, summarizes, and indexes the world's trending stories every
            30 minutes — then lets you ask questions about them in plain English.
          </p>
        </div>
      </section>

      <section className="container page__section">
        <div className="about-grid">
          <article className="about-card">
            <h2>Our mission</h2>
            <p>
              The signal-to-noise ratio in modern news is broken. Faxum Press is an
              experiment in using LLMs, vector search, and good old web scraping to
              rebuild the newsroom from the ground up — neutral, fast, and queryable.
            </p>
          </article>
          <article className="about-card">
            <h2>What makes it different</h2>
            <ul className="about-list">
              <li>✅ Auto-loads on open — no query required</li>
              <li>✅ Worldwide coverage across 28 countries</li>
              <li>✅ RAG-backed answers cite the articles they used</li>
              <li>✅ 100% provider-agnostic LLM layer</li>
              <li>✅ Rich images via 3-tier extraction pipeline</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="container page__section">
        <h2 className="section-heading">How it works</h2>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-card__num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container page__section">
        <h2 className="section-heading">Built with</h2>
        <div className="stack-grid">
          {stack.map(([group, items]) => (
            <div key={group} className="stack-card">
              <h3 className="stack-card__title">{group}</h3>
              <div className="stack-card__chips">
                {items.map((i) => (
                  <span key={i} className="chip">{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
